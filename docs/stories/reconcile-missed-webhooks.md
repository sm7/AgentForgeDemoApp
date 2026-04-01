# Reconcile Missed Webhooks

## User Story
As a Payments Service, I want to reconcile missed webhooks, so that I can ensure payment states are consistent.

## Acceptance Criteria
- The system must run a reconciliation job every 15 minutes to check for discrepancies between local state and Stripe.
- Given a discrepancy is found, when the reconciliation job runs, then the system must update the local state to match Stripe.

## Effort
M

## Dependencies
- Handle Stripe Webhooks
