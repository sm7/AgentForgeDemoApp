# Reconciliation Worker for Payment State

## User Story
As the payments service operator, I want a reconciliation worker to periodically compare internal payment records against Stripe's state, so that any discrepancies caused by missed webhooks or processing failures are detected and corrected.

## Acceptance Criteria
- The system must query Postgres for payment intents that have remained in a non-terminal status (e.g. 'created' or 'processing') beyond a configurable threshold and cross-check their status against the Stripe API.
- Given a discrepancy is found between the internal Postgres status and the Stripe API status, when the worker runs, then the Postgres record must be updated to match the Stripe status and a corrective event must be published to payments.events.
- The system must log a structured summary after each reconciliation run including the number of records checked, updated, and any errors encountered.

## Effort
L

## Dependencies
- Handle Stripe Webhooks Securely
- Publish Payment Events to Kafka
