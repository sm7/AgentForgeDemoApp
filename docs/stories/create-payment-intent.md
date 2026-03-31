# Create Payment Intent

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that a Stripe PaymentIntent is initialised and its state is persisted before the customer completes checkout.

## Acceptance Criteria
- The system must require a valid RS256-signed JWT and an Idempotency-Key header on every POST /v2/payment-intents request, returning 401 or 400 respectively if either is missing or invalid.
- Given a valid request with a new Idempotency-Key, When the endpoint is called, Then a Stripe PaymentIntent is created via the async stripe-python client and the intent state is stored in the payment_intents Postgres table, returning HTTP 201 with the intent ID and client secret.
- Given a valid request with a previously seen Idempotency-Key within 24 hours, When the endpoint is called again, Then the system must return the original response from the Redis cache without creating a duplicate Stripe PaymentIntent.
- The system must retry failed Stripe API calls up to 3 times using exponential backoff before returning a 502 error to the caller.

## Effort
L

## Dependencies
- None
