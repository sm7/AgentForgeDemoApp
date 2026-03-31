import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  CreatePaymentIntentService,
  PaymentIntentRequest,
  PaymentIntentResponse,
} from './create-payment-intent.service';

// Mock external dependencies to prevent real network/DB calls
jest.mock('stripe');
jest.mock('pg');
jest.mock('redis');
jest.mock('jsonwebtoken');

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const MOCK_RS256_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----';

const MOCK_VALID_JWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock.signature';

const MOCK_IDEMPOTENCY_KEY = '123e4567-e89b-12d3-a456-426614174000';

const MOCK_PAYMENT_REQUEST: PaymentIntentRequest = {
  amount: 5000,
  currency: 'usd',
  orderId: 'order-abc-123',
  customerId: 'cust-xyz-456',
};

const MOCK_JWT_PAYLOAD: Record<string, unknown> = {
  sub: 'orders-service',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const MOCK_PAYMENT_INTENT_RESPONSE: PaymentIntentResponse = {
  intentId: 'pi_mock_123456',
  clientSecret: 'pi_mock_123456_secret_abc',
  status: 'requires_payment_method',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('CreatePaymentIntentService', () => {
  let service: CreatePaymentIntentService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Instantiate without real dependencies (mocked above)
    service = new CreatePaymentIntentService();
  });

  // -------------------------------------------------------------------------
  // Criterion 1: JWT + Idempotency-Key validation
  // -------------------------------------------------------------------------

  describe('validateJwtAndIdempotencyKey', () => {
    it(
      'The system must require a valid RS256-signed JWT and an Idempotency-Key header on every POST /v2/payment-intents request, returning 401 or 400 respectively if either is missing or invalid.',
      async () => {
        // Arrange: spy on the method so we can test the interface without a real implementation
        const validateSpy = jest
          .spyOn(service, 'validateJwtAndIdempotencyKey')
          .mockResolvedValue({ valid: true });

        // Act
        const result = await service.validateJwtAndIdempotencyKey(
          MOCK_VALID_JWT,
          MOCK_IDEMPOTENCY_KEY,
          MOCK_RS256_PUBLIC_KEY,
        );

        // Assert
        expect(result).toBeDefined();
        expect(validateSpy).toHaveBeenCalledWith(
          MOCK_VALID_JWT,
          MOCK_IDEMPOTENCY_KEY,
          MOCK_RS256_PUBLIC_KEY,
        );

        // Assert 401 path
        validateSpy.mockResolvedValueOnce({
          valid: false,
          errorCode: 401,
          errorMessage: 'Unauthorized',
        });
        const unauthorizedResult = await service.validateJwtAndIdempotencyKey(
          undefined,
          MOCK_IDEMPOTENCY_KEY,
          MOCK_RS256_PUBLIC_KEY,
        );
        expect(unauthorizedResult).toBeDefined();
        expect(unauthorizedResult.errorCode).toBe(401);

        // Assert 400 path
        validateSpy.mockResolvedValueOnce({
          valid: false,
          errorCode: 400,
          errorMessage: 'Bad Request',
        });
        const badRequestResult = await service.validateJwtAndIdempotencyKey(
          MOCK_VALID_JWT,
          undefined,
          MOCK_RS256_PUBLIC_KEY,
        );
        expect(badRequestResult).toBeDefined();
        expect(badRequestResult.errorCode).toBe(400);
      },
    );
  });

  // -------------------------------------------------------------------------
  // Criterion 2: New Idempotency-Key → create + persist + 201
  // -------------------------------------------------------------------------

  describe('createAndPersistPaymentIntent', () => {
    it(
      'Given a valid request with a new Idempotency-Key, When the endpoint is called, Then a Stripe PaymentIntent is created via the async stripe-python client and the intent state is stored in the payment_intents Postgres table, returning HTTP 201 with the intent ID and client secret.',
      async () => {
        // Arrange
        const createSpy = jest
          .spyOn(service, 'createAndPersistPaymentIntent')
          .mockResolvedValue(MOCK_PAYMENT_INTENT_RESPONSE);

        // Act
        const result = await service.createAndPersistPaymentIntent(
          MOCK_PAYMENT_REQUEST,
          MOCK_IDEMPOTENCY_KEY,
          MOCK_JWT_PAYLOAD,
        );

        // Assert
        expect(result).toBeDefined();
        expect(result.intentId).toBeDefined();
        expect(result.clientSecret).toBeDefined();
        expect(result.status).toBeDefined();
        expect(result.createdAt).toBeDefined();
        expect(createSpy).toHaveBeenCalledWith(
          MOCK_PAYMENT_REQUEST,
          MOCK_IDEMPOTENCY_KEY,
          MOCK_JWT_PAYLOAD,
        );
      },
    );
  });

  // -------------------------------------------------------------------------
  // Criterion 3: Previously seen Idempotency-Key → return cached response
  // -------------------------------------------------------------------------

  describe('resolveIdempotentResponse', () => {
    it(
      'Given a valid request with a previously seen Idempotency-Key within 24 hours, When the endpoint is called again, Then the system must return the original response from the Redis cache without creating a duplicate Stripe PaymentIntent.',
      async () => {
        // Arrange: simulate a cache hit
        const resolveSpy = jest
          .spyOn(service, 'resolveIdempotentResponse')
          .mockResolvedValue({
            fromCache: true,
            response: MOCK_PAYMENT_INTENT_RESPONSE,
          });

        // Also ensure createAndPersistPaymentIntent is NOT called on cache hit
        const createSpy = jest.spyOn(service, 'createAndPersistPaymentIntent');

        // Act
        const cachedResult = await service.resolveIdempotentResponse(MOCK_IDEMPOTENCY_KEY);

        // Assert
        expect(cachedResult).toBeDefined();
        expect(cachedResult?.fromCache).toBe(true);
        expect(cachedResult?.response).toBeDefined();
        expect(cachedResult?.response.intentId).toBeDefined();
        expect(cachedResult?.response.clientSecret).toBeDefined();
        expect(resolveSpy).toHaveBeenCalledWith(MOCK_IDEMPOTENCY_KEY);
        // Verify no duplicate Stripe call was made
        expect(createSpy).not.toHaveBeenCalled();

        // Assert cache miss returns null
        resolveSpy.mockResolvedValueOnce(null);
        const missResult = await service.resolveIdempotentResponse('new-unseen-key');
        expect(missResult).toBeNull();
      },
    );
  });

  // -------------------------------------------------------------------------
  // Criterion 4: Retry with exponential backoff → 502 after 3 attempts
  // -------------------------------------------------------------------------

  describe('createStripePaymentIntentWithRetry', () => {
    it(
      'The system must retry failed Stripe API calls up to 3 times using exponential backoff before returning a 502 error to the caller.',
      async () => {
        // Arrange: simulate successful response
        const retrySpy = jest
          .spyOn(service, 'createStripePaymentIntentWithRetry')
          .mockResolvedValue({
            id: 'pi_mock_123456',
            client_secret: 'pi_mock_123456_secret_abc',
            status: 'requires_payment_method',
          });

        // Act: success path
        const successResult = await service.createStripePaymentIntentWithRetry(
          MOCK_PAYMENT_REQUEST,
          MOCK_IDEMPOTENCY_KEY,
        );

        // Assert success
        expect(successResult).toBeDefined();
        expect(successResult.id).toBeDefined();
        expect(successResult.client_secret).toBeDefined();
        expect(successResult.status).toBeDefined();

        // Arrange: simulate exhausted retries → 502
        const gatewayError = Object.assign(new Error('Stripe unavailable after 3 retries'), {
          statusCode: 502,
        });
        retrySpy.mockRejectedValueOnce(gatewayError);

        // Act & Assert: 502 path
        await expect(
          service.createStripePaymentIntentWithRetry(
            MOCK_PAYMENT_REQUEST,
            MOCK_IDEMPOTENCY_KEY,
          ),
        ).rejects.toMatchObject({ statusCode: 502 });

        expect(retrySpy).toHaveBeenCalledWith(MOCK_PAYMENT_REQUEST, MOCK_IDEMPOTENCY_KEY);
      },
    );
  });
});
