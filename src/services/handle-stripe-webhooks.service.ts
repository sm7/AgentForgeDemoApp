// import Stripe from 'stripe';
// import { EventPublisher } from '../events/event-publisher';
// import { PaymentRepository } from '../repositories/payment.repository';

/**
 * HandleStripeWebhooks
 *
 * Handles incoming Stripe webhook events so that payment states are updated
 * automatically and domain events are published downstream.
 *
 * User Story: As a developer, I want the system to handle Stripe webhooks,
 * so that payment states are updated automatically.
 *
 * Dependencies: Create Payment Intent
 */
export class HandleStripeWebhooks {
  private readonly webhookSecret: string;

  constructor(
    webhookSecret: string,
    // private readonly paymentRepository: PaymentRepository,
    // private readonly eventPublisher: EventPublisher,
  ) {
    this.webhookSecret = webhookSecret;
  }

  /**
   * verifyStripeSignatureHeader
   *
   * Acceptance Criterion: The system must verify the Stripe-Signature header
   * using stripe.WebhookSignature.verify_header.
   *
   * Verifies the authenticity of an incoming Stripe webhook request by
   * validating the `Stripe-Signature` header against the raw request payload
   * and the configured webhook secret.
   *
   * @param rawBody - The raw, unparsed request body as a Buffer or string.
   * @param signatureHeader - The value of the `Stripe-Signature` HTTP header.
   * @returns The verified Stripe Event object if the signature is valid.
   * @throws Error if the signature verification fails.
   */
  verifyStripeSignatureHeader(
    rawBody: Buffer | string,
    signatureHeader: string,
  ): /* Stripe.Event */ Record<string, unknown> {
    // TODO: Implement Stripe-Signature verification.
    // Example:
    //   const event = stripe.webhooks.constructEvent(
    //     rawBody,
    //     signatureHeader,
    //     this.webhookSecret,
    //   );
    //   return event;
    throw new Error('Not implemented: verifyStripeSignatureHeader');
  }

  /**
   * handleValidWebhookEvent
   *
   * Acceptance Criterion: Given a valid webhook event, when it is received,
   * then the system must update the payment state and publish a domain event.
   *
   * Processes a verified Stripe webhook event by updating the corresponding
   * payment record in the repository and publishing a domain event to notify
   * other parts of the system of the state change.
   *
   * @param event - A verified Stripe Event object.
   * @returns A promise that resolves when the payment state has been updated
   *          and the domain event has been published.
   */
  async handleValidWebhookEvent(
    event: /* Stripe.Event */ Record<string, unknown>,
  ): Promise<void> {
    // TODO: Implement payment state update and domain event publishing.
    // Example:
    //   const paymentIntentId = (event.data.object as Stripe.PaymentIntent).id;
    //   await this.paymentRepository.updatePaymentState(
    //     paymentIntentId,
    //     event.type,
    //   );
    //   await this.eventPublisher.publish({
    //     type: 'PaymentStateUpdated',
    //     payload: { paymentIntentId, stripeEventType: event.type },
    //   });
    throw new Error('Not implemented: handleValidWebhookEvent');
  }
}
