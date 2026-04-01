# Handle Stripe Webhooks

## User Story
As the payments service, I want to securely receive and process Stripe webhook events via POST /v2/webhooks/stripe, so that payment state changes are reflected in the system in real time.

## Acceptance Criteria
- Given an incoming webhook request, when the Stripe-Signature header is present and valid, then the service must process the event and update the corresponding payment intent status in Postgres.
- Given an incoming webhook request with a missing or invalid Stripe-Signature header, when POST /v2/webhooks/stripe is called, then the service must reject the request with a 400 and log the security violation.
- The system must publish a structured event to the Kafka topic payments.events after successfully processing each webhook event.
- The system must return a 200 response to Stripe immediately upon successful signature verification and event queuing, even if downstream processing is asynchronous.

## Effort
L

## Dependencies
- Create Payment Intent
