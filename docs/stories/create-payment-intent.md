# Create Payment Intent

## User Story
As an Orders Service, I want to create a payment intent, so that I can initiate a payment process for an order.

## Acceptance Criteria
- The system must allow POST requests to /v2/payment-intents with necessary order details.
- Given a valid request with an Idempotency-Key, when the payment intent is created, then the system must store the intent state in Postgres.

## Effort
M

## Dependencies
- None
