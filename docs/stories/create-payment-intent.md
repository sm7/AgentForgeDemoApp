# Create Payment Intent

## User Story
As a developer, I want to create a payment intent using the Payment Intent Service, so that I can initiate a payment process with Stripe.

## Acceptance Criteria
- The system must create a Stripe PaymentIntent and store the intent state in Postgres.
- Given a valid request to POST /v2/payment-intents, when the request includes an Idempotency-Key, then the system must ensure the request is idempotent.

## Effort
M

## Dependencies
- None
