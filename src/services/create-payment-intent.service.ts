// import Stripe from 'stripe';
// import { Pool } from 'pg';

/**
 * @class CreatePaymentIntent
 * @description Service responsible for creating payment intents via Stripe
 * and persisting intent state to Postgres, with support for idempotent requests.
 *
 * User Story: As a developer, I want to create a payment intent using the
 * Payment Intent Service, so that I can initiate a payment process with Stripe.
 */
export class CreatePaymentIntent {
  private stripeClient: any;
  private dbPool: any;

  constructor(stripeClient?: any, dbPool?: any) {
    this.stripeClient = stripeClient ?? null;
    this.dbPool = dbPool ?? null;
  }

  /**
   * @method createStripePaymentIntentAndStoreState
   * @description Creates a Stripe PaymentIntent and stores the resulting intent
   * state in Postgres.
   *
   * Acceptance Criterion: The system must create a Stripe PaymentIntent and
   * store the intent state in Postgres.
   *
   * @param {CreatePaymentIntentParams} params - Parameters required to create the payment intent.
   * @returns {Promise<PaymentIntentRecord>} The created payment intent record including Stripe and DB state.
   */
  async createStripePaymentIntentAndStoreState(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntentRecord> {
    // TODO: Call this.stripeClient.paymentIntents.create({ amount, currency, ...params })
    // TODO: Insert the returned PaymentIntent into Postgres via this.dbPool
    // TODO: Return the combined record
    throw new Error('Not implemented: createStripePaymentIntentAndStoreState');
  }

  /**
   * @method ensureIdempotentRequest
   * @description Ensures that a POST /v2/payment-intents request bearing an
   * Idempotency-Key is handled idempotently — returning the previously created
   * PaymentIntent if the key has already been used.
   *
   * Acceptance Criterion: Given a valid request to POST /v2/payment-intents,
   * when the request includes an Idempotency-Key, then the system must ensure
   * the request is idempotent.
   *
   * @param {string} idempotencyKey - The Idempotency-Key header value from the request.
   * @param {CreatePaymentIntentParams} params - Parameters required to create the payment intent.
   * @returns {Promise<PaymentIntentRecord>} The existing or newly created payment intent record.
   */
  async ensureIdempotentRequest(
    idempotencyKey: string,
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntentRecord> {
    // TODO: Query Postgres for an existing record matching idempotencyKey
    // TODO: If found, return the existing PaymentIntentRecord
    // TODO: If not found, call createStripePaymentIntentAndStoreState(params)
    //       and persist the idempotencyKey alongside the new record
    // TODO: Return the resulting PaymentIntentRecord
    throw new Error('Not implemented: ensureIdempotentRequest');
  }
}

// ---------------------------------------------------------------------------
// Supporting types
// ---------------------------------------------------------------------------

export interface CreatePaymentIntentParams {
  /** Amount in the smallest currency unit (e.g. cents for USD). */
  amount: number;
  /** ISO 4217 currency code, e.g. "usd". */
  currency: string;
  /** Optional customer identifier. */
  customerId?: string;
  /** Arbitrary metadata to attach to the intent. */
  metadata?: Record<string, string>;
}

export interface PaymentIntentRecord {
  /** Internal database primary key. */
  id: string;
  /** Stripe PaymentIntent ID (e.g. "pi_xxx"). */
  stripePaymentIntentId: string;
  /** Current status of the PaymentIntent as reported by Stripe. */
  status: string;
  /** Amount in the smallest currency unit. */
  amount: number;
  /** ISO 4217 currency code. */
  currency: string;
  /** Idempotency key used when creating this record, if any. */
  idempotencyKey?: string;
  /** Timestamp when the record was created in Postgres. */
  createdAt: Date;
  /** Timestamp when the record was last updated in Postgres. */
  updatedAt: Date;
}
