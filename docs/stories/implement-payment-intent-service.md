# Implement Payment Intent Service
## User Story
As a developer, I want to implement the Payment Intent Service, so that the Orders Service can create and manage payment intents.
## Acceptance Criteria
- The system must handle POST requests to /v2/payment-intents and create a payment intent in the Postgres database.
- Given a valid request, when the Orders Service calls the endpoint, then the system must return a 201 status code with the payment intent details.
## Effort
L
## Dependencies
- None
