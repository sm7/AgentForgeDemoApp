# Reconcile Stale and Missed Payment States

## User Story
As the Payments Service operator, I want a reconciliation worker to run every 15 minutes, so that payment intents stuck in a processing state due to missed webhooks are detected and corrected automatically.

## Acceptance Criteria
- The system must deploy the Reconciliation Worker as a Kubernetes CronJob scheduled at a 15-minute interval, and each run must query the payment_intents table for records in a processing state older than a configurable staleness threshold.
- Given a stale payment intent is identified during a reconciliation run, When the worker queries the Stripe API for the current PaymentIntent status, Then the local payment_intents record must be updated to match the Stripe-side status and a corrective entry must be written to the payment_events audit log.
- The system must emit a structured log entry summarising the number of intents inspected, updated, and errored for each reconciliation run to support operational monitoring.

## Effort
M

## Dependencies
- Create Payment Intent
- Handle and Verify Stripe Webhooks

<!-- TODO: Implement story -->
