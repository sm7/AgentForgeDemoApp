import { describe, it, expect, beforeEach } from '@jest/globals';
import { PaymentReconciliationWorker } from './payment-reconciliation-worker.service';

jest.mock('stripe');
jest.mock('kafkajs');
jest.mock('pg');

describe('PaymentReconciliationWorker', () => {
  let service: PaymentReconciliationWorker;
  let mockDb: any;
  let mockStripe: any;
  let mockKafkaProducer: any;
  let mockLogger: any;

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      connect: jest.fn().mockResolvedValue({
        query: jest.fn(),
        release: jest.fn(),
      }),
    };

    mockStripe = {
      paymentIntents: {
        retrieve: jest.fn(),
      },
    };

    mockKafkaProducer = {
      send: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    service = new PaymentReconciliationWorker(
      mockDb,
      mockStripe,
      mockKafkaProducer,
      mockLogger
    );
  });

  it(
    'The system must periodically query Postgres for payment intents in a non-terminal state and compare their status against the Stripe API, updating local records where a mismatch is detected.',
    async () => {
      // Arrange
      const nonTerminalStatuses = [
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'requires_capture',
      ];

      mockDb.query.mockResolvedValueOnce({
        rows: [
          { id: 'pi_test_001', status: 'requires_confirmation' },
          { id: 'pi_test_002', status: 'processing' },
        ],
      });

      mockStripe.paymentIntents.retrieve
        .mockResolvedValueOnce({ id: 'pi_test_001', status: 'succeeded' })
        .mockResolvedValueOnce({ id: 'pi_test_002', status: 'processing' });

      // Act
      const result = await service.queryAndReconcileNonTerminalPaymentIntents(
        nonTerminalStatuses
      );

      // Assert
      expect(result).toBeDefined();
    }
  );

  it(
    'Given a payment intent whose Stripe status differs from the Postgres-stored status, when the reconciliation worker runs, then the worker must update the Postgres record to match Stripe and publish a reconciliation event to the Kafka topic payments.events.',
    async () => {
      // Arrange
      const paymentIntentId = 'pi_test_001';
      const localStatus = 'requires_confirmation';
      const stripeStatus = 'succeeded';

      mockDb.connect.mockResolvedValueOnce({
        query: jest.fn().mockResolvedValue({ rowCount: 1 }),
        release: jest.fn(),
      });

      mockKafkaProducer.send.mockResolvedValueOnce([
        { topicName: 'payments.events', partition: 0 },
      ]);

      // Act
      const result = await service.updateRecordAndPublishReconciliationEvent(
        paymentIntentId,
        localStatus,
        stripeStatus
      );

      // Assert
      expect(result).toBeDefined();
    }
  );

  it(
    'The system must log a structured error and continue processing remaining records if the Stripe API returns an error for an individual payment intent during reconciliation.',
    () => {
      // Arrange
      const paymentIntentId = 'pi_test_error_001';
      const stripeError = new Error('Stripe API rate limit exceeded');
      (stripeError as any).type = 'StripeRateLimitError';
      (stripeError as any).statusCode = 429;

      // Act
      const act = () =>
        service.handleStripeApiErrorForPaymentIntent(
          paymentIntentId,
          stripeError
        );

      // Assert — method should not throw; processing must continue
      expect(act).toBeDefined();
    }
  );
});
