# Handle Stripe Webhooks

## User Story
As a Payments Service, I want to handle Stripe webhooks, so that I can update payment states based on external events.

## Acceptance Criteria
- The system must verify the Stripe-Signature header for all incoming webhook requests.
- Given a valid webhook event, when it is received, then the system must update the payment state and publish a domain event to Kafka.

## Effort
L

## Dependencies
- Create Payment Intent
