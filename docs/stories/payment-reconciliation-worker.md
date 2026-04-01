# Payment Reconciliation Worker

## User Story
As a payments operations team member, I want an automated reconciliation worker to compare internal payment records against Stripe, so that discrepancies are detected and flagged without manual intervention.

## Acceptance Criteria
- The system must periodically query Postgres for payment intents in a non-terminal state and compare their status against the Stripe API, updating local records where a mismatch is detected.
- Given a payment intent whose Stripe status differs from the Postgres-stored status, when the reconciliation worker runs, then the worker must update the Postgres record to match Stripe and publish a reconciliation event to the Kafka topic payments.events.
- The system must log a structured error and continue processing remaining records if the Stripe API returns an error for an individual payment intent during reconciliation.

## Effort
M

## Dependencies
- Handle Stripe Webhooks
