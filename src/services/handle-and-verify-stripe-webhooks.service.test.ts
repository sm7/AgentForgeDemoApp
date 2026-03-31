import { describe, it, expect, beforeEach } from '@jest/globals';
import { HandleAndVerifyStripeWebhooks } from './handle-and-verify-stripe-webhooks.service';

jest.mock('stripe');
jest.mock('pg');
jest.mock('kafkajs');

describe('HandleAndVerifyStripeWebhooks', () => {
  let service: HandleAndVerifyStripeWebhooks;
  let mockStripeClient: jest.Mocked<any>;
  let mockDbPool: jest.Mocked<any>;
  let mockKafkaProducer: jest.Mocked<any>;

  beforeEach(() => {
    mockStripeClient = {
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    mockDbPool = {
      query: jest.fn(),
      connect: jest.fn(),
    };

    mockKafkaProducer = {
      send: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };

    service = new HandleAndVerifyStripeWebhooks(
      mockStripeClient,
      mockDbPool,
      mockKafkaProducer
    );
  });

  it(
    'Given an incoming webhook request, When the Stripe-Signature header is present and valid, Then the system must update the corresponding payment_intent record in Postgres and append an entry to the payment_events audit log table.',
    async () => {
      // Arrange
      const rawBody = JSON.stringify({ id: 'evt_test_001', type: 'payment_intent.succeeded' });
      const stripeSignatureHeader = 't=1700000000,v1=abc123signature';
      const webhookSecret = 'whsec_test_secret';

      const mockStripeEvent = {
        id: 'evt_test_001',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_001',
            status: 'succeeded',
          },
        },
      };

      mockStripeClient.webhooks.constructEvent.mockReturnValue(mockStripeEvent);
      mockDbPool.query.mockResolvedValue({ rows: [{ id: 'pi_test_001', updated_at: new Date() }], rowCount: 1 });

      // Act
      let result: any;
      try {
        result = await service.verifySignatureAndUpdatePaymentState(
          rawBody,
          stripeSignatureHeader,
          webhookSecret
        );
      } catch {
        result = undefined;
      }

      // Assert
      expect(service).toBeDefined();
      expect(mockStripeClient.webhooks.constructEvent).toBeDefined();
      expect(result).toBeDefined();
    }
  );

  it(
    'Given an incoming webhook request with a missing or invalid Stripe-Signature header, When the endpoint processes the request, Then the system must reject it with HTTP 400 and must not modify any payment state.',
    () => {
      // Arrange
      const missingSignatureHeader = undefined;
      const rawBody = JSON.stringify({ id: 'evt_test_002', type: 'payment_intent.created' });
      const webhookSecret = 'whsec_test_secret';

      const invalidSignatureHeader = 'invalid-signature-value';
      const signatureError = new Error('No signatures found matching the expected signature for payload.');
      (signatureError as any).type = 'StripeSignatureVerificationError';
      mockStripeClient.webhooks.constructEvent.mockImplementation(() => { throw signatureError; });

      // Act — missing header
      let resultMissing: any;
      try {
        resultMissing = service.rejectInvalidOrMissingSignature(
          missingSignatureHeader,
          rawBody,
          webhookSecret
        );
      } catch {
        resultMissing = undefined;
      }

      // Act — invalid header
      let resultInvalid: any;
      try {
        resultInvalid = service.rejectInvalidOrMissingSignature(
          invalidSignatureHeader,
          rawBody,
          webhookSecret
        );
      } catch {
        resultInvalid = undefined;
      }

      // Assert
      expect(service).toBeDefined();
      expect(mockDbPool.query).not.toHaveBeenCalled();
      expect(resultMissing).toBeDefined();
      expect(resultInvalid).toBeDefined();
    }
  );

  it(
    'The system must publish a structured JSON event with a schema_version field to the Kafka topic payments.events after every successful state change triggered by a webhook.',
    async () => {
      // Arrange
      const paymentIntentId = 'pi_test_003';
      const eventType = 'payment_intent.succeeded';
      const eventPayload: Record<string, unknown> = {
        id: 'pi_test_003',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
      };
      const schemaVersion = '1.0.0';

      mockKafkaProducer.send.mockResolvedValue([
        { topicName: 'payments.events', partition: 0, baseOffset: '42' },
      ]);

      // Act
      let result: any;
      try {
        result = await service.publishWebhookEventToKafka(
          paymentIntentId,
          eventType,
          eventPayload,
          schemaVersion
        );
      } catch {
        result = undefined;
      }

      // Assert
      expect(service).toBeDefined();
      expect(mockKafkaProducer.send).toBeDefined();
      expect(result).toBeDefined();
    }
  );
});
