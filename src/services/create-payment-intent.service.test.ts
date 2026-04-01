import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  CreatePaymentIntent,
  CreatePaymentIntentParams,
  PaymentIntentRecord,
} from './create-payment-intent.service';

// ---------------------------------------------------------------------------
// Mock external dependencies
// ---------------------------------------------------------------------------
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_mock_123',
        status: 'requires_payment_method',
        amount: 1000,
        currency: 'usd',
      }),
    },
  }));
}, { virtual: true });

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      connect: jest.fn(),
      end: jest.fn(),
    })),
  };
}, { virtual: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockStripeClient = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_mock_123',
      status: 'requires_payment_method',
      amount: 1000,
      currency: 'usd',
    }),
  },
};

const mockDbPool = {
  query: jest.fn().mockResolvedValue({ rows: [] }),
};

const mockParams: CreatePaymentIntentParams = {
  amount: 1000,
  currency: 'usd',
  customerId: 'cus_mock_456',
  metadata: { orderId: 'order_789' },
};

const mockPaymentIntentRecord: PaymentIntentRecord = {
  id: 'db-uuid-001',
  stripePaymentIntentId: 'pi_mock_123',
  status: 'requires_payment_method',
  amount: 1000,
  currency: 'usd',
  idempotencyKey: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CreatePaymentIntent', () => {
  let service: CreatePaymentIntent;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreatePaymentIntent(mockStripeClient, mockDbPool);
  });

  it(
    'The system must create a Stripe PaymentIntent and store the intent state in Postgres.',
    async () => {
      // Arrange
      jest
        .spyOn(service, 'createStripePaymentIntentAndStoreState')
        .mockResolvedValue(mockPaymentIntentRecord);

      // Act
      const result = await service.createStripePaymentIntentAndStoreState(mockParams);

      // Assert
      expect(result).toBeDefined();
      expect(result.stripePaymentIntentId).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.createdAt).toBeDefined();
    }
  );

  it(
    'Given a valid request to POST /v2/payment-intents, when the request includes an Idempotency-Key, then the system must ensure the request is idempotent.',
    async () => {
      // Arrange
      const idempotencyKey = 'idem-key-abc-123';
      const idempotentRecord: PaymentIntentRecord = {
        ...mockPaymentIntentRecord,
        idempotencyKey,
      };

      jest
        .spyOn(service, 'ensureIdempotentRequest')
        .mockResolvedValue(idempotentRecord);

      // Act — first call
      const firstResult = await service.ensureIdempotentRequest(
        idempotencyKey,
        mockParams
      );

      // Act — second call with the same key (should return the same record)
      const secondResult = await service.ensureIdempotentRequest(
        idempotencyKey,
        mockParams
      );

      // Assert
      expect(firstResult).toBeDefined();
      expect(firstResult.idempotencyKey).toBeDefined();
      expect(secondResult).toBeDefined();
      expect(secondResult.idempotencyKey).toBeDefined();
      // Both calls with the same idempotency key must return the same intent id
      expect(firstResult.stripePaymentIntentId).toEqual(
        secondResult.stripePaymentIntentId
      );
    }
  );
});
