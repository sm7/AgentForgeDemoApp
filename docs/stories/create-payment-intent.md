# Create Payment Intent

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that I can initiate a payment transaction for a customer order.

## Acceptance Criteria
- The system must accept a valid JWT in the Authorization header and reject requests with a 401 status if the token is missing or invalid.
- The system must accept an Idempotency-Key header and return the same payment intent response for duplicate requests with the same key without creating a duplicate record in Postgres or calling Stripe twice.
- Given a valid request payload and JWT, when POST /v2/payment-intents is called, then the service must create a PaymentIntent via the Stripe API, persist the intent state to Postgres, and return a 201 response containing the payment intent ID and client secret.
- Given the Stripe API returns a transient error, when the request is processed, then the service must retry using the configured retry decorator and return a 502 only after all retries are exhausted.

## Effort
L

## Dependencies
- None
