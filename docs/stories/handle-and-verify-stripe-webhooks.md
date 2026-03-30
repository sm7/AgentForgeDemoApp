# Handle and Verify Stripe Webhooks

## User Story
As the Payments Service, I want to receive and cryptographically verify Stripe webhook events via POST /v2/webhooks/stripe, so that payment state is updated accurately and only from authenticated Stripe callbacks.

## Acceptance Criteria
- Given a POST /v2/webhooks/stripe request is received, When the Stripe-Signature header is validated via stripe.WebhookSignature.verify_header, Then the service must update the corresponding payment_intents record to reflect the new payment state and append an entry to the payment_events audit log.
- Given a POST /v2/webhooks/stripe request is received with an invalid or missing Stripe-Signature header, When signature verification fails, Then the service must return HTTP 400 and must not modify any payment state.
- The system must handle at minimum the Stripe event types payment_intent.succeeded, payment_intent.payment_failed, and payment_intent.canceled, mapping each to the correct internal status transition.

## Effort
M

## Dependencies
- Create Payment Intent

<!-- TODO: Implement story -->
