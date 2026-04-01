// import Stripe from 'stripe';

/**
 * ProcessRefundsService
 *
 * Handles refund processing through the Refund API, allowing customer service
 * agents to process refunds so that customers can receive their money back efficiently.
 *
 * Dependencies: Create Payment Intent
 */
export class ProcessRefundsService {
  // private stripe: Stripe;

  constructor() {
    // TODO: Initialise Stripe client
    // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2023-10-16' });
  }

  /**
   * Validates a charge before a refund request is processed.
   *
   * Acceptance Criterion:
   * "The system must validate charges before processing a refund request."
   *
   * @param chargeId - The identifier of the charge to validate.
   * @returns A promise that resolves to `true` if the charge is valid, `false` otherwise.
   */
  async validateChargeBeforeRefund(chargeId: string): Promise<boolean> {
    // TODO: Retrieve the charge from Stripe (or internal DB) and verify it exists,
    //       has not already been fully refunded, and belongs to a completed payment.
    throw new Error('Not implemented: validateChargeBeforeRefund');
  }

  /**
   * Processes a refund by calling Stripe after confirming the charge is valid.
   *
   * Acceptance Criterion:
   * "Given a valid refund request to POST /v2/refunds, when the charge is valid,
   *  then the system must call Stripe to process the refund."
   *
   * @param chargeId - The identifier of the charge to refund.
   * @param amount   - Optional partial refund amount in the smallest currency unit (e.g. cents).
   *                   If omitted the full charge amount is refunded.
   * @returns A promise that resolves to the Stripe Refund object (typed as `unknown` until
   *          the Stripe SDK is wired in).
   */
  async processRefundViaStripe(
    chargeId: string,
    amount?: number
  ): Promise<unknown> {
    // TODO: 1. Call this.validateChargeBeforeRefund(chargeId) and throw if invalid.
    // TODO: 2. Call this.stripe.refunds.create({ charge: chargeId, amount }) to issue the refund.
    // TODO: 3. Persist the refund record to the database.
    // TODO: 4. Return the Stripe Refund object.
    throw new Error('Not implemented: processRefundViaStripe');
  }
}
