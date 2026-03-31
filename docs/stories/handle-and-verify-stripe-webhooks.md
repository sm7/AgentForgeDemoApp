# Handle and Verify Stripe Webhooks

## User Story
As the Payments Service, I want to receive and verify Stripe webhook events via POST /v2/webhooks/stripe, so that payment state is kept accurate in real time without relying solely on polling.

## Acceptance Criteria
- Given an incoming webhook request, When the Stripe-Signature header is present and valid, Then the system must update the corresponding payment_intent record in Postgres and append an entry to the payment_events audit log table.
- Given an incoming webhook request with a missing or invalid Stripe-Signature header, When the endpoint processes the request, Then the system must reject it with HTTP 400 and must not modify any payment state.
- The system must publish a structured JSON event with a schema_version field to the Kafka topic payments.events after every successful state change triggered by a webhook.

## Effort
L

## Dependencies
- Create Payment Intent
