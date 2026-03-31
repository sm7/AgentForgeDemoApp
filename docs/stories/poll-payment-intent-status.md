# Poll Payment Intent Status

## User Story
As the Orders Service, I want to retrieve the current status of a payment intent via GET /v2/payment-intents/:id, so that I can confirm payment completion before fulfilling an order.

## Acceptance Criteria
- Given a valid RS256-signed JWT and an existing payment intent ID, When GET /v2/payment-intents/:id is called, Then the system must return HTTP 200 with the current intent status and metadata read from the payment_intents Postgres table.
- Given a valid JWT and a payment intent ID that does not exist, When the endpoint is called, Then the system must return HTTP 404 with a descriptive error message.
- The system must require a valid RS256-signed JWT on every GET /v2/payment-intents/:id request, returning HTTP 401 if the token is missing or invalid.

## Effort
S

## Dependencies
- Create Payment Intent
