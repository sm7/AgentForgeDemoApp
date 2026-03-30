# Payment Intent Creation

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents so that I can initiate a payment for a customer order and receive a Stripe PaymentIntent in return.

## Acceptance Criteria
- The system must create a Stripe PaymentIntent via the stripe-python async client and persist the intent state (id, status, amount, currency, created_at) to the payment_intents Postgres table.
- Given a POST /v2/payment-intents request is received without an Idempotency-Key header, When the request is processed, Then the service must reject the request with HTTP 422 and an error message indicating the header is required.
- Given a POST /v2/payment-intents request is received with a previously used Idempotency-Key, When the key is found in Redis within its 24h TTL, Then the service must return the original response without creating a duplicate Stripe PaymentIntent.
- The system must authenticate inbound requests using RS256-signed service-to-service JWTs and reject unauthenticated requests with HTTP 401.

## Effort
L

## Dependencies
- None

<!-- TODO: Implement story -->
