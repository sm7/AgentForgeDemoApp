// import Stripe from 'stripe';
// import { Redis } from 'ioredis';
// import { db } from '../db';
// import { UnprocessableEntityError } from '../errors';

/**
 * ProcessRefundRequests
 *
 * Handles submission and processing of refund requests via POST /v2/refunds.
 * Ensures eligible charges are refunded through Stripe, payment records are
 * updated, duplicate requests are prevented via Redis idempotency keys, and
 * invalid payment intent states are rejected before touching the Stripe API.
 */
export class ProcessRefundRequests {
  private stripe: any;
  private redis: any;
  private db: any;

  constructor(stripe: any, redis: any, db: any) {
    this.stripe = stripe;
    this.redis = redis;
    this.db = db;
  }

  /**
   * processRefundForSucceededPaymentIntent
   *
   * Acceptance Criterion:
   * Given a valid JWT, Idempotency-Key, and a payment intent ID referencing a
   * successfully charged payment, When POST /v2/refunds is called, Then the
   * system must call the Stripe Refunds API and update the payment_intents
   * record to reflect the refunded state.
   *
   * @param jwtPayload       - Decoded and verified JWT payload for the requesting agent
   * @param idempotencyKey   - Unique idempotency key supplied by the caller
   * @param paymentIntentId  - Stripe payment intent ID to be refunded
   * @param amountPence      - Optional partial refund amount in smallest currency unit
   * @returns                The created Stripe Refund object and updated payment record
   */
  async processRefundForSucceededPaymentIntent(
    jwtPayload: Record<string, unknown>,
    idempotencyKey: string,
    paymentIntentId: string,
    amountPence?: number
  ): Promise<{ stripeRefund: unknown; updatedPaymentIntent: unknown }> {
    // TODO: Verify jwtPayload contains required claims (e.g. sub, role)
    // TODO: Retrieve payment_intents record from DB by paymentIntentId
    // TODO: Confirm payment intent status is 'succeeded'
    // TODO: Call this.stripe.refunds.create({ payment_intent: paymentIntentId, amount: amountPence })
    // TODO: Update payment_intents record status to 'refunded' in DB
    // TODO: Return { stripeRefund, updatedPaymentIntent }
    throw new Error('TODO: processRefundForSucceededPaymentIntent not implemented');
  }

  /**
   * rejectRefundForNonChargeablePaymentIntent
   *
   * Acceptance Criterion:
   * Given a refund request for a payment intent that is not in a chargeable or
   * succeeded state, When the endpoint is called, Then the system must return
   * HTTP 422 with a validation error and must not call the Stripe API.
   *
   * @param paymentIntentId - Stripe payment intent ID whose state is to be validated
   * @returns               Never resolves — always throws an UnprocessableEntityError
   */
  async rejectRefundForNonChargeablePaymentIntent(
    paymentIntentId: string
  ): Promise<never> {
    // TODO: Retrieve payment_intents record from DB by paymentIntentId
    // TODO: Check current status; if not 'succeeded' or 'chargeable', throw HTTP 422
    // TODO: Ensure this.stripe.refunds.create is NOT called in this path
    // TODO: Throw new UnprocessableEntityError('Payment intent is not in a refundable state')
    throw new Error('TODO: rejectRefundForNonChargeablePaymentIntent not implemented');
  }

  /**
   * storeIdempotencyKeyInRedis
   *
   * Acceptance Criterion:
   * The system must store the idempotency key in Redis with a 24-hour TTL to
   * prevent duplicate refund calls for the same request.
   *
   * @param idempotencyKey - Unique idempotency key to persist
   * @param responsePayload - Serialisable response to cache against the key
   * @returns               Resolves when the key has been successfully stored
   */
  async storeIdempotencyKeyInRedis(
    idempotencyKey: string,
    responsePayload: Record<string, unknown>
  ): Promise<void> {
    // TODO: Serialise responsePayload to JSON
    // TODO: Call this.redis.set(idempotencyKey, serialised, 'EX', 86400)
    // TODO: On subsequent requests with the same key, return cached response early
    throw new Error('TODO: storeIdempotencyKeyInRedis not implemented');
  }
}
