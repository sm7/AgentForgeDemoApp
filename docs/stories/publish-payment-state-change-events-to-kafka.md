# Publish Payment State-Change Events to Kafka

## User Story
As a downstream internal service, I want structured payment state-change events published to the payments.events Kafka topic, so that I can react to payment lifecycle changes without polling the Payments Service directly.

## Acceptance Criteria
- The system must publish a JSON event to the payments.events Kafka topic whenever a payment intent transitions state, and every event payload must include a schema_version field along with the payment intent ID, new status, and event timestamp.
- Given a payment state transition is persisted to Postgres, When the Payment Event Publisher attempts to publish to Kafka via aiokafka, Then the event must be delivered to the payments.events topic within 5 seconds under normal operating conditions.
- The system must not publish an event to Kafka before the corresponding state change has been successfully committed to Postgres, ensuring event ordering consistency.

## Effort
M

## Dependencies
- Handle and Verify Stripe Webhooks

<!-- TODO: Implement story -->
