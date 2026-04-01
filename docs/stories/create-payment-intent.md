# Create Payment Intent

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that a customer's payment can be initiated and tracked through to completion.

## Acceptance Criteria
- The system must accept a valid JWT in the Authorization header and reject requests with a 401 if the token is missing or invalid.
- Given a valid request body and a unique Idempotency-Key header, when POST /v2/payment-intents is called, then the service must create a PaymentIntent via the Stripe API, persist the intent state to Postgres, and return a 201 response with the payment intent ID and status.
- Given the same Idempotency-Key is submitted a second time, when POST /v2/payment-intents is called again, then the system must return the original response from Redis without creating a duplicate Stripe PaymentIntent.
- The system must return a 422 with a descriptive error body if required fields (e.g. amount, currency, order_id) are missing from the request.

## Effort
L

## Dependencies
- None
