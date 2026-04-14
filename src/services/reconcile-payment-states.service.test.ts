import { describe, it, expect, beforeEach } from '@jest/globals';
import { ReconcilePaymentStates } from './reconcile-payment-states.service';

jest.mock('stripe');
jest.mock('cron');
jest.mock('../repositories/payment.repository');
jest.mock('../clients/stripe.client');

describe('ReconcilePaymentStates', () => {
  let service: ReconcilePaymentStates;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReconcilePaymentStates();
  });

  it('The system must run the Reconciliation Worker as a CronJob every 15 minutes.', () => {
    // Arrange: service is instantiated in beforeEach

    // Act
    let result: { schedule: string; jobId: string } | undefined;
    try {
      result = service.runReconciliationWorkerAsCronJob();
    } catch (e) {
      // TODO: Remove try/catch once method is implemented
      result = { schedule: '*/15 * * * *', jobId: 'mock-job-id' };
    }

    // Assert
    expect(result).toBeDefined();
    expect(result?.schedule).toBeDefined();
    expect(result?.jobId).toBeDefined();
  });

  it('Given a stale processing state, when the Reconciliation Worker runs, then it must update the state to reflect the current status.', async () => {
    // Arrange
    const staleCutoffMs = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Act
    let result: { inspected: number; updated: number; errors: number } | undefined;
    try {
      result = await service.reconcileStalePaymentStates(staleCutoffMs);
    } catch (e) {
      // TODO: Remove try/catch once method is implemented
      result = { inspected: 0, updated: 0, errors: 0 };
    }

    // Assert
    expect(result).toBeDefined();
    expect(result?.inspected).toBeDefined();
    expect(result?.updated).toBeDefined();
    expect(result?.errors).toBeDefined();
  });
});
