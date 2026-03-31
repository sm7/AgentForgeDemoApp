# Handle Stripe Webhooks Securely

## User Story
As the payments service, I want to receive and verify Stripe webhook events via POST /v2/webhooks/stripe, so that payment status changes are reliably reflected in the system without accepting forged requests.

## Acceptance Criteria
- The system must validate the Stripe-Signature header on every incoming webhook request and return a 400 response if the signature is missing or does not match.
- Given a valid webhook event of type payment_intent.succeeded is received, when the handler processes it, then the corresponding payment intent record in Postgres must be updated to status 'succeeded'.
- Given a valid webhook event is processed successfully, when the handler completes, then a payment event must be published to the Kafka topic payments.events.

## Effort
M

## Dependencies
- Create Payment Intent
