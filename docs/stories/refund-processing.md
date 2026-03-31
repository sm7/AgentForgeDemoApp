# Refund Processing

## User Story
As a Customer Service agent, I want to submit a refund request via POST /v2/refunds, so that eligible charges are refunded through Stripe and the payment record is updated accordingly.

## Acceptance Criteria
- Given a POST /v2/refunds request is received with a valid RS256 JWT and Idempotency-Key, when the referenced charge exists and is in a refundable state, then the system must call the Stripe Refunds API and update the payment_intents record to reflect the refund.
- Given a POST /v2/refunds request is received, when the referenced charge does not exist or is not in a refundable state, then the system must return a 422 Unprocessable Entity response without calling the Stripe API.
- The system must store the Idempotency-Key for refund requests in Redis with a 24-hour TTL and return the original response for duplicate submissions within that window.

## Effort
M

## Dependencies
- Payment Intent Creation
- Stripe Webhook Handling and State Updates
