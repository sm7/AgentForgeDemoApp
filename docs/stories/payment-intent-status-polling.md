# Payment Intent Status Polling

## User Story
As the Orders Service, I want to retrieve the current status of a payment intent via GET /v2/payment-intents/:id so that I can confirm payment outcomes when webhook delivery cannot be relied upon.

## Acceptance Criteria
- Given a GET /v2/payment-intents/:id request is made with a valid RS256 JWT and an existing intent ID, When the request is processed, Then the service must return HTTP 200 with the current status, amount, currency, and last updated timestamp from the payment_intents Postgres table.
- Given a GET /v2/payment-intents/:id request references an intent ID that does not exist, When the request is processed, Then the service must return HTTP 404 with a structured error body.
- The system must reject GET /v2/payment-intents/:id requests with missing or invalid RS256 JWTs with HTTP 401.

## Effort
S

## Dependencies
- Payment Intent Creation

<!-- TODO: Implement story -->
