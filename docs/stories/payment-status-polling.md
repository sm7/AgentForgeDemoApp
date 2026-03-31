# Payment Status Polling

## User Story
As the Orders Service, I want to retrieve the current state of a payment intent via GET /v2/payment-intents/:id, so that I can reflect accurate payment status in order workflows.

## Acceptance Criteria
- Given a GET /v2/payment-intents/:id request is received with a valid RS256 JWT, when the payment intent ID exists in Postgres, then the system must return the current intent state with a 200 response.
- Given a GET /v2/payment-intents/:id request is received with a valid RS256 JWT, when the payment intent ID does not exist, then the system must return a 404 response.
- Given a GET /v2/payment-intents/:id request is received without a valid RS256 JWT, when the service validates the token, then the system must reject the request with a 401 Unauthorized response.

## Effort
S

## Dependencies
- Payment Intent Creation
