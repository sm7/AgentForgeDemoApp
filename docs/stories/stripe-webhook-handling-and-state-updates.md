# Stripe Webhook Handling and State Updates

## User Story
As the Payments Service, I want to receive and verify Stripe webhook events via POST /v2/webhooks/stripe, so that payment intent states are kept accurate and downstream systems are notified of changes.

## Acceptance Criteria
- Given a webhook request is received at POST /v2/webhooks/stripe, when the Stripe-Signature header fails verification via stripe.WebhookSignature.verify_header, then the system must reject the request with a 400 response and not update any payment state.
- Given a valid verified Stripe webhook event is received, when the event indicates a payment state change, then the system must update the corresponding record in the payment_intents table and publish a structured JSON event to the payments.events Kafka topic including a schema_version field.
- The system must record all processed webhook events in the payment_events audit log table in Postgres.

## Effort
L

## Dependencies
- Payment Intent Creation
