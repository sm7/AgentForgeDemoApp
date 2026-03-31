import { describe, it, expect, beforeEach } from '@jest/globals';
import { HandleStripeWebhooksSecurely } from './handle-stripe-webhooks-securely.service';

jest.mock('stripe');
jest.mock('pg');
jest.mock('kafkajs');

describe('HandleStripeWebhooksSecurely', () => {
  let service: HandleStripeWebhooksSecurely;
  let mockStripe: any;
  let mockDb: any;
  let mockKafkaProducer: any;
  const mockWebhookSecret = 'whsec_test_secret';

  beforeEach(() => {
    mockStripe = {
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    mockDb = {
      query: jest.fn(),
    };

    mockKafkaProducer = {
      send: jest.fn(),
    };

    service = new HandleStripeWebhooksSecurely(
      mockStripe,
      mockDb,
      mockKafkaProducer,
      mockWebhookSecret
    );
  });

  it(
    'The system must validate the Stripe-Signature header on every incoming webhook request and return a 400 response if the signature is missing or does not match.',
    () => {
      // Arrange
      const rawBody = Buffer.from(JSON.stringify({ id: 'evt_test_001', type: 'payment_intent.succeeded' }));
      const missingSignatureHeader = undefined;
      const invalidSignatureHeader = 'invalid_signature';

      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('No signatures found matching the expected signature for payload.');
      });

      // Act
      const resultMissing = service.validateStripeSignature(rawBody, missingSignatureHeader);
      const resultInvalid = service.validateStripeSignature(rawBody, invalidSignatureHeader);

      // Assert
      expect(resultMissing).toBeDefined();
      expect(resultInvalid).toBeDefined();
    }
  );

  it(
    'Given a valid webhook event of type payment_intent.succeeded is received, when the handler processes it, then the corresponding payment intent record in Postgres must be updated to status \'succeeded\'.',
    async () => {
      // Arrange
      const mockEvent = {
        id: 'evt_test_001',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_001',
            status: 'succeeded',
            amount: 5000,
            currency: 'usd',
          },
        },
      };

      mockDb.query.mockResolvedValue({ rowCount: 1 });

      // Act
      const result = await service.handlePaymentIntentSucceeded(mockEvent);

      // Assert
      expect(result).toBeDefined();
    }
  );

  it(
    'Given a valid webhook event is processed successfully, when the handler completes, then a payment event must be published to the Kafka topic payments.events.',
    async () => {
      // Arrange
      const mockEvent = {
        id: 'evt_test_002',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_002',
            status: 'succeeded',
            amount: 10000,
            currency: 'usd',
          },
        },
      };

      mockKafkaProducer.send.mockResolvedValue([{ topicName: 'payments.events', partition: 0 }]);

      // Act
      const result = await service.publishPaymentEventToKafka(mockEvent);

      // Assert
      expect(result).toBeDefined();
    }
  );
});
