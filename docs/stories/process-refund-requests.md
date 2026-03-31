# Process Refund Requests

## User Story
As a Customer Service agent, I want to submit a refund request via POST /v2/refunds, so that eligible charges are refunded through Stripe and the payment record is updated accordingly.

## Acceptance Criteria
- Given a valid JWT, Idempotency-Key, and a payment intent ID referencing a successfully charged payment, When POST /v2/refunds is called, Then the system must call the Stripe Refunds API and update the payment_intents record to reflect the refunded state.
- Given a refund request for a payment intent that is not in a chargeable or succeeded state, When the endpoint is called, Then the system must return HTTP 422 with a validation error and must not call the Stripe API.
- The system must store the idempotency key in Redis with a 24-hour TTL to prevent duplicate refund calls for the same request.

## Effort
M

## Dependencies
- Create Payment Intent
- Handle and Verify Stripe Webhooks
