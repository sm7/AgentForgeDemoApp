# Stripe Webhook Handling and State Updates

## User Story
As the Payments Service, I want to receive and verify Stripe webhook events via POST /v2/webhooks/stripe so that payment intent states are kept accurate and downstream systems are notified of changes.

## Acceptance Criteria
- Given a webhook request arrives at POST /v2/webhooks/stripe, When the Stripe-Signature header is present and valid, Then the service must update the corresponding payment_intents record in Postgres with the new status and append an entry to the payment_events audit log table.
- Given a webhook request arrives with an invalid or missing Stripe-Signature header, When signature verification via stripe.WebhookSignature.verify_header fails, Then the service must reject the request with HTTP 400 and must not update any database state.
- The system must publish a structured JSON event with a schema_version field to the Kafka topic payments.events after every successful state change triggered by a webhook.

## Effort
L

## Dependencies
- Payment Intent Creation

<!-- TODO: Implement story -->
