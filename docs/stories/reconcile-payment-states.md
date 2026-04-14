# Reconcile Payment States

## User Story
As a system administrator, I want the Reconciliation Worker to reconcile payment states, so that missed webhooks and stale processing states are corrected.

## Acceptance Criteria
- The system must run the Reconciliation Worker as a CronJob every 15 minutes.
- Given a stale processing state, when the Reconciliation Worker runs, then it must update the state to reflect the current status.

## Effort
L

## Dependencies
- Handle Stripe Webhooks
