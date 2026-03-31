# Reconciliation Worker for Missed Webhooks

## User Story
As the Payments Service operator, I want a reconciliation worker to run every 15 minutes, so that payment intents stuck in stale processing states due to missed webhooks are detected and corrected.

## Acceptance Criteria
- The system must deploy the Reconciliation Worker as a Kubernetes CronJob that executes on a 15-minute schedule and queries Postgres for payment_intents records that remain in a processing state beyond an expected threshold.
- Given a stale payment intent is identified, when the worker queries the Stripe API for the current intent status, then the system must update the payment_intents record in Postgres and publish a corrective state-change event to the payments.events Kafka topic.
- The system must log a structured summary of each reconciliation run including the count of stale intents found, updated, and any errors encountered.

## Effort
M

## Dependencies
- Stripe Webhook Handling and State Updates
- Payment Event Publishing to Kafka
