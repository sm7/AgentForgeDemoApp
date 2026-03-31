# Create Payment Intent

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that a customer's payment can be initiated and tracked through to completion.

## Acceptance Criteria
- The system must accept a valid JSON payload with required fields (order_id, amount, currency) and return a 201 response containing a payment_intent_id and initial status.
- Given a request is submitted with an Idempotency-Key header that was already used, when the endpoint is called again with the same key, then the system must return the original response without creating a duplicate payment intent.
- The system must authenticate the incoming request using a shared JWT and return a 401 response if the token is missing or invalid.
- Given a payment intent is successfully created in Postgres, when the endpoint responds, then the payment intent record must be persisted with status 'created' before the response is returned.

## Effort
L

## Dependencies
- None
