# Poll Payment Intent Status

## User Story
As the Orders Service, I want to retrieve the current status of a payment intent via GET /v2/payment-intents/:id, so that I can reflect accurate payment state to customers without relying solely on webhooks.

## Acceptance Criteria
- Given a valid payment_intent_id and a valid JWT, when the endpoint is called, then the system must return a 200 response containing the payment_intent_id, current status, and last updated timestamp.
- The system must return a 404 response when the requested payment_intent_id does not exist in Postgres.
- The system must return a 401 response if the request does not include a valid shared JWT.

## Effort
S

## Dependencies
- Create Payment Intent
