# Payment Intent Creation

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that a Stripe PaymentIntent is initialised and its state is persisted for the order.

## Acceptance Criteria
- The system must create a Stripe PaymentIntent via the stripe-python async client and store the resulting intent state in the payment_intents Postgres table before returning a response.
- Given a POST /v2/payment-intents request is received with a valid RS256 JWT and an Idempotency-Key header, when the key has been seen within the last 24 hours, then the system must return the original response without creating a duplicate Stripe PaymentIntent.
- Given a POST /v2/payment-intents request is received without a valid RS256 JWT, when the service validates the token, then the system must reject the request with a 401 Unauthorized response.
- The system must retry failed Stripe API calls using exponential backoff with a maximum of 3 attempts before returning an error response.

## Effort
L

## Dependencies
- None
