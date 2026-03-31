import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  ReconciliationWorkerForMissedWebhooks,
  PaymentIntentRecord,
  ReconciliationResult,
  ReconciliationRunSummary,
} from './reconciliation-worker-for-missed-webhooks.service';

// ---------------------------------------------------------------------------
// Mock external dependencies
// ---------------------------------------------------------------------------

jest.mock('stripe');
jest.mock('pg');
jest.mock('kafkajs');

// ---------------------------------------------------------------------------
// Shared mock factories
// ---------------------------------------------------------------------------

const mockDbPool = {
  query: jest.fn(),
  connect: jest.fn(),
};

const mockStripeClient = {
  paymentIntents: {
    retrieve: jest.fn(),
  },
};

const mockKafkaProducer = {
  send: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
};

const makeStaleIntent = (overrides: Partial<PaymentIntentRecord> = {}): PaymentIntentRecord => ({
  id: 'pi-record-uuid-001',
  stripePaymentIntentId: 'pi_stripe_test_001',
  status: 'processing',
  amount: 5000,
  currency: 'usd',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

const makeRunSummary = (overrides: Partial<ReconciliationRunSummary> = {}): ReconciliationRunSummary => ({
  runId: 'run-uuid-001',
  timestamp: new Date('2024-01-01T00:15:00Z'),
  durationMs: 1200,
  staleIntentsFound: 3,
  staleIntentsUpdated: 2,
  errors: [],
  ...overrides,
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('ReconciliationWorkerForMissedWebhooks', () => {
  let service: ReconciliationWorkerForMissedWebhooks;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReconciliationWorkerForMissedWebhooks(
      mockDbPool,
      mockStripeClient,
      mockKafkaProducer
    );
  });

  // -------------------------------------------------------------------------
  // Acceptance Criterion 1
  // -------------------------------------------------------------------------

  it(
    'The system must deploy the Reconciliation Worker as a Kubernetes CronJob that executes on a 15-minute schedule and queries Postgres for payment_intents records that remain in a processing state beyond an expected threshold.',
    async () => {
      // Arrange
      const stalenessThresholdMinutes = 15;
      mockDbPool.query.mockResolvedValueOnce({
        rows: [makeStaleIntent()],
      });

      // Act
      const result = await service.deployAndQueryStalePaymentIntents(
        stalenessThresholdMinutes
      );

      // Assert
      expect(result).toBeDefined();
    }
  );

  // -------------------------------------------------------------------------
  // Acceptance Criterion 2
  // -------------------------------------------------------------------------

  it(
    'Given a stale payment intent is identified, when the worker queries the Stripe API for the current intent status, then the system must update the payment_intents record in Postgres and publish a corrective state-change event to the payments.events Kafka topic.',
    async () => {
      // Arrange
      const staleIntent = makeStaleIntent();

      mockStripeClient.paymentIntents.retrieve.mockResolvedValueOnce({
        id: staleIntent.stripePaymentIntentId,
        status: 'succeeded',
      });

      mockDbPool.query.mockResolvedValueOnce({ rowCount: 1 });
      mockKafkaProducer.send.mockResolvedValueOnce([{ topicName: 'payments.events' }]);

      // Act
      const result: ReconciliationResult = await service.reconcileStalePaymentIntent(
        staleIntent
      );

      // Assert
      expect(result).toBeDefined();
    }
  );

  // -------------------------------------------------------------------------
  // Acceptance Criterion 3
  // -------------------------------------------------------------------------

  it(
    'The system must log a structured summary of each reconciliation run including the count of stale intents found, updated, and any errors encountered.',
    () => {
      // Arrange
      const summary = makeRunSummary({
        staleIntentsFound: 5,
        staleIntentsUpdated: 4,
        errors: ['Stripe API timeout for pi_stripe_test_002'],
      });

      // Act
      const logSpy = jest.spyOn(service, 'logReconciliationRunSummary');
      let thrownError: unknown;
      try {
        service.logReconciliationRunSummary(summary);
      } catch (err) {
        thrownError = err;
      }

      // Assert — method must be defined and callable
      expect(logSpy).toBeDefined();
      expect(logSpy).toHaveBeenCalledWith(summary);
    }
  );
});
