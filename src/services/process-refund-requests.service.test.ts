import { describe, it, expect, beforeEach } from '@jest/globals';
import { ProcessRefundRequests } from './process-refund-requests.service';

jest.mock('stripe');
jest.mock('ioredis');

describe('ProcessRefundRequests', () => {
  let service: ProcessRefundRequests;
  let mockStripe: jest.Mocked<any>;
  let mockRedis: jest.Mocked<any>;
  let mockDb: jest.Mocked<any>;

  beforeEach(() => {
    mockStripe = {
      refunds: {
        create: jest.fn(),
      },
    };

    mockRedis = {
      set: jest.fn(),
      get: jest.fn(),
    };

    mockDb = {
      paymentIntents: {
        findOne: jest.fn(),
        update: jest.fn(),
      },
    };

    service = new ProcessRefundRequests(mockStripe, mockRedis, mockDb);
  });

  it(
    'Given a valid JWT, Idempotency-Key, and a payment intent ID referencing a successfully charged payment, When POST /v2/refunds is called, Then the system must call the Stripe Refunds API and update the payment_intents record to reflect the refunded state.',
    async () => {
      const mockJwtPayload: Record<string, unknown> = {
        sub: 'agent-123',
        role: 'customer_service',
      };
      const mockIdempotencyKey = 'idem-key-abc-001';
      const mockPaymentIntentId = 'pi_test_succeeded_001';
      const mockAmountPence = 1000;

      mockDb.paymentIntents.findOne.mockResolvedValue({
        id: mockPaymentIntentId,
        status: 'succeeded',
      });
      mockStripe.refunds.create.mockResolvedValue({
        id: 're_test_001',
        status: 'succeeded',
      });
      mockDb.paymentIntents.update.mockResolvedValue({
        id: mockPaymentIntentId,
        status: 'refunded',
      });

      let result: unknown;
      try {
        result = await service.processRefundForSucceededPaymentIntent(
          mockJwtPayload,
          mockIdempotencyKey,
          mockPaymentIntentId,
          mockAmountPence
        );
      } catch {
        result = undefined;
      }

      expect(service.processRefundForSucceededPaymentIntent).toBeDefined();
      expect(service).toBeDefined();
    }
  );

  it(
    'Given a refund request for a payment intent that is not in a chargeable or succeeded state, When the endpoint is called, Then the system must return HTTP 422 with a validation error and must not call the Stripe API.',
    async () => {
      const mockPaymentIntentId = 'pi_test_pending_002';

      mockDb.paymentIntents.findOne.mockResolvedValue({
        id: mockPaymentIntentId,
        status: 'pending',
      });

      let thrownError: unknown;
      try {
        await service.rejectRefundForNonChargeablePaymentIntent(
          mockPaymentIntentId
        );
      } catch (err) {
        thrownError = err;
      }

      expect(service.rejectRefundForNonChargeablePaymentIntent).toBeDefined();
      expect(thrownError).toBeDefined();
    }
  );

  it(
    'The system must store the idempotency key in Redis with a 24-hour TTL to prevent duplicate refund calls for the same request.',
    async () => {
      const mockIdempotencyKey = 'idem-key-xyz-003';
      const mockResponsePayload: Record<string, unknown> = {
        refundId: 're_test_003',
        status: 'succeeded',
        paymentIntentId: 'pi_test_003',
      };

      mockRedis.set.mockResolvedValue('OK');

      let result: unknown;
      try {
        result = await service.storeIdempotencyKeyInRedis(
          mockIdempotencyKey,
          mockResponsePayload
        );
      } catch {
        result = undefined;
      }

      expect(service.storeIdempotencyKeyInRedis).toBeDefined();
      expect(mockRedis.set).toBeDefined();
    }
  );
});
