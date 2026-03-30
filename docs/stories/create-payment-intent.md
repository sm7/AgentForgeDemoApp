# Create Payment Intent

## User Story
As the Orders Service, I want to create a payment intent via POST /v2/payment-intents, so that a Stripe PaymentIntent is initialised and its state is persisted before the customer completes checkout.

## Acceptance Criteria
- The system must create a Stripe PaymentIntent via the stripe-python async client and store the resulting intent record in the payment_intents Postgres table with status, stripe_intent_id, and created_at fields.
- Given a POST /v2/payment-intents request is received with a valid RS256 JWT and a unique Idempotency-Key header, When the request is processed, Then the service must return HTTP 201 with the payment intent ID and current status.
- Given a POST /v2/payment-intents request is received with an Idempotency-Key that was used within the last 24 hours, When the request is processed, Then the service must return the original response without creating a duplicate Stripe PaymentIntent.
- The system must reject any POST /v2/payment-intents request missing the Idempotency-Key header with HTTP 422, and any request with an invalid or missing RS256 JWT with HTTP 401.

## Effort
L

## Dependencies
- None

<!-- TODO: Implement story -->
