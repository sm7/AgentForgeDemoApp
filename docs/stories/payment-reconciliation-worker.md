# Payment Reconciliation Worker

## User Story
As the Payments Service, I want a reconciliation worker to run every 15 minutes so that missed webhooks and stale processing states are detected and corrected without manual intervention.

## Acceptance Criteria
- The system must deploy the Reconciliation Worker as a Kubernetes CronJob scheduled at a 15-minute interval, separate from the main FastAPI service deployment.
- Given a payment_intents record has remained in a processing state beyond a configurable staleness threshold, When the reconciliation worker runs, Then the worker must query the Stripe API for the current PaymentIntent status and update the Postgres record and audit log accordingly.
- The system must publish a payments.events Kafka event for any payment intent whose status is corrected during a reconciliation run.

## Effort
M

## Dependencies
- Stripe Webhook Handling and State Updates

<!-- TODO: Implement story -->
