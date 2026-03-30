# Process Refund Requests

## User Story
As a Customer Service agent, I want to submit a refund request via POST /v2/refunds, so that eligible charges are refunded through Stripe and the payment record reflects the updated state.

## Acceptance Criteria
- Given a POST /v2/refunds request is received with a valid RS256 JWT, a valid Idempotency-Key, and a payment intent ID referencing a succeeded charge, When the request is processed, Then the service must call the Stripe Refunds API and update the payment_intents record status to refunded upon success.
- Given a POST /v2/refunds request references a payment intent that is not in a succeeded state, When the request is validated, Then the service must return HTTP 422 with a descriptive error and must not call the Stripe API.
- The system must retry failed Stripe Refund API calls using exponential backoff with a maximum of 3 attempts before returning an error response.

## Effort
M

## Dependencies
- Create Payment Intent
- Publish Payment State-Change Events to Kafka

<!-- TODO: Implement story -->
