# Handle Stripe Webhooks

## User Story
As a developer, I want the system to handle Stripe webhooks, so that payment states are updated automatically.

## Acceptance Criteria
- The system must verify the Stripe-Signature header using stripe.WebhookSignature.verify_header.
- Given a valid webhook event, when it is received, then the system must update the payment state and publish a domain event.

## Effort
M

## Dependencies
- Create Payment Intent
