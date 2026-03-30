# Poll Payment Intent Status

## User Story
As the Orders Service, I want to retrieve the current status of a payment intent via GET /v2/payment-intents/:id, so that I can reflect accurate payment state in the order lifecycle without relying solely on event-driven updates.

## Acceptance Criteria
- Given a GET /v2/payment-intents/:id request is received with a valid RS256 JWT and an existing payment intent ID, When the request is processed, Then the service must return HTTP 200 with the payment intent ID, current status, and last updated timestamp sourced from the payment_intents Postgres table.
- Given a GET /v2/payment-intents/:id request references a payment intent ID that does not exist in the database, When the request is processed, Then the service must return HTTP 404 with a structured error body.
- The system must reject GET /v2/payment-intents/:id requests with an invalid or missing RS256 JWT with HTTP 401.

## Effort
S

## Dependencies
- Create Payment Intent

<!-- TODO: Implement story -->
