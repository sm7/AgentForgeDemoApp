# Refund API

## User Story
As the Customer Service tooling, I want to submit refund requests via POST /v2/refunds so that I can initiate refunds against successfully charged payment intents on behalf of customers.

## Acceptance Criteria
- Given a POST /v2/refunds request references a payment intent that does not exist or is not in a succeeded state, When the request is processed, Then the service must reject it with HTTP 422 and a descriptive error message without calling the Stripe Refunds API.
- Given a valid POST /v2/refunds request is received with an Idempotency-Key, When the refund is successfully processed by Stripe, Then the service must persist the refund record to Postgres, publish a refund event to payments.events, and return HTTP 200 with the refund details.
- The system must retry failed Stripe Refund API calls using exponential backoff with a maximum of 3 attempts before returning an error response.

## Effort
M

## Dependencies
- Payment Intent Creation

<!-- TODO: Implement story -->
