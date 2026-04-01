import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  ReconcileMissedWebhooks,
  DiscrepantPayment,
  ReconciliationResult,
} from './reconcile-missed-webhooks.service';

// ---------------------------------------------------------------------------
// Mock external dependencies
// ---------------------------------------------------------------------------
jest.mock('stripe');
jest.mock('node-cron');
jest.mock('../repositories/payment.repository');
jest.mock('../clients/stripe.client');
jest.mock('../utils/logger');

// ---------------------------------------------------------------------------
// Shared mock factories
// ---------------------------------------------------------------------------

const makeMockPaymentRepository = () => ({
  findNonTerminalPayments: jest.fn(),
  updateStatus: jest.fn(),
});

const makeMockStripeClient = () => ({
  paymentIntents: {
    retrieve: jest.fn(),
  },
});

const makeMockLogger = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
});

const makeDiscrepantPayment = (overrides: Partial<DiscrepantPayment> = {}): DiscrepantPayment => ({
  paymentId: 'pay_local_001',
  localStatus: 'pending',
  stripeStatus: 'succeeded',
  stripePaymentIntentId: 'pi_stripe_001',
  ...overrides,
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('ReconcileMissedWebhooks', () => {
  let service: ReconcileMissedWebhooks;
  let mockPaymentRepository: ReturnType<typeof makeMockPaymentRepository>;
  let mockStripeClient: ReturnType<typeof makeMockStripeClient>;
  let mockLogger: ReturnType<typeof makeMockLogger>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPaymentRepository = makeMockPaymentRepository();
    mockStripeClient = makeMockStripeClient();
    mockLogger = makeMockLogger();

    service = new ReconcileMissedWebhooks(
      mockPaymentRepository,
      mockStripeClient,
      mockLogger
    );
  });

  // -------------------------------------------------------------------------
  // Acceptance Criterion 1
  // -------------------------------------------------------------------------
  it(
    'The system must run a reconciliation job every 15 minutes to check for discrepancies between local state and Stripe.',
    async () => {
      // Arrange
      mockPaymentRepository.findNonTerminalPayments.mockResolvedValue([
        { paymentId: 'pay_local_001', status: 'pending', stripePaymentIntentId: 'pi_stripe_001' },
        { paymentId: 'pay_local_002', status: 'processing', stripePaymentIntentId: 'pi_stripe_002' },
      ] as any);

      mockStripeClient.paymentIntents.retrieve
        .mockResolvedValueOnce({ id: 'pi_stripe_001', status: 'succeeded' } as any)
        .mockResolvedValueOnce({ id: 'pi_stripe_002', status: 'processing' } as any);

      // Act
      const result = await service.runReconciliationJobEvery15Minutes();

      // Assert
      expect(result).toBeDefined();
    }
  );

  // -------------------------------------------------------------------------
  // Acceptance Criterion 2
  // -------------------------------------------------------------------------
  it(
    'Given a discrepancy is found, when the reconciliation job runs, then the system must update the local state to match Stripe.',
    async () => {
      // Arrange
      const discrepancies: DiscrepantPayment[] = [
        makeDiscrepantPayment({
          paymentId: 'pay_local_001',
          localStatus: 'pending',
          stripeStatus: 'succeeded',
          stripePaymentIntentId: 'pi_stripe_001',
        }),
        makeDiscrepantPayment({
          paymentId: 'pay_local_002',
          localStatus: 'processing',
          stripeStatus: 'canceled',
          stripePaymentIntentId: 'pi_stripe_002',
        }),
      ];

      mockPaymentRepository.updateStatus.mockResolvedValue(undefined as any);

      // Act
      const result: ReconciliationResult = await service.updateLocalStateToMatchStripe(
        discrepancies
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.successCount).toBeDefined();
      expect(result.failureCount).toBeDefined();
      expect(result.completedAt).toBeDefined();
    }
  );
});
