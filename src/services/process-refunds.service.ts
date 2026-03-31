// import Stripe from 'stripe';
// import { Pool } from 'pg';
// import { Kafka, Producer } from 'kafkajs';

/**
 * ProcessRefundsService
 *
 * Handles the business logic for processing refunds via POST /v2/refunds.
 * Responsible for validating payment intent status, calling the Stripe Refunds API,
 * persisting refund records in Postgres, and publishing refund events to Kafka.
 *
 * @dependency Handle Stripe Webhooks Securely
 */
export class ProcessRefundsService {
  private stripe: any;
  private db: any;
  private kafkaProducer: any;

  constructor(stripe: any, db: any, kafkaProducer: any) {
    this.stripe = stripe;
    this.db = db;
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * Calls the Stripe Refunds API and persists a refund record in Postgres with status 'pending'.
   *
   * Acceptance Criterion:
   * Given a valid refund request referencing a payment intent with status 'succeeded',
   * when the endpoint is called, then the system must call the Stripe Refunds API and
   * persist a refund record in Postgres with status 'pending'.
   *
   * @param paymentIntentId - The ID of the payment intent to refund.
   * @param amount - Optional partial refund amount in smallest currency unit (e.g. cents).
   * @param reason - Optional reason for the refund.
   * @returns The persisted refund record with status 'pending'.
   */
  async callStripeRefundsApiAndPersistPendingRecord(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ id: string; paymentIntentId: string; status: 'pending'; stripeRefundId: string; amount: number; reason?: string }> {
    // TODO: Call this.stripe.refunds.create({ payment_intent: paymentIntentId, amount, reason })
    // TODO: Insert a refund record into Postgres with status 'pending' using this.db
    // TODO: Return the persisted refund record
    throw new Error('Not implemented');
  }

  /**
   * Validates that the referenced payment intent has a status of 'succeeded';
   * returns a 422-compatible error if it does not.
   *
   * Acceptance Criterion:
   * The system must return a 422 response if the referenced payment intent does not
   * have a status of 'succeeded' at the time of the refund request.
   *
   * @param paymentIntentId - The ID of the payment intent to validate.
   * @returns The payment intent object if valid.
   * @throws UnprocessableEntityError (422) if the payment intent status is not 'succeeded'.
   */
  async validatePaymentIntentSucceeded(
    paymentIntentId: string
  ): Promise<{ id: string; status: string }> {
    // TODO: Retrieve the payment intent from Stripe or Postgres: this.stripe.paymentIntents.retrieve(paymentIntentId)
    // TODO: If paymentIntent.status !== 'succeeded', throw a 422 UnprocessableEntityError
    // TODO: Return the payment intent object
    throw new Error('Not implemented');
  }

  /**
   * Publishes a refund event to the Kafka topic 'payments.events' after a successful
   * Stripe refund initiation.
   *
   * Acceptance Criterion:
   * Given a refund is successfully initiated, when the Stripe API call completes,
   * then a refund event must be published to the Kafka topic payments.events.
   *
   * @param refundRecord - The refund record to publish as an event payload.
   * @returns void
   */
  async publishRefundEventToKafka(
    refundRecord: { id: string; paymentIntentId: string; status: string; stripeRefundId: string; amount: number; reason?: string }
  ): Promise<void> {
    // TODO: Construct a refund event payload from refundRecord
    // TODO: Call this.kafkaProducer.send({ topic: 'payments.events', messages: [{ key: refundRecord.id, value: JSON.stringify(eventPayload) }] })
    throw new Error('Not implemented');
  }
}
