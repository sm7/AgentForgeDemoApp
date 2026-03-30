# Payment Event Publishing to Kafka

## User Story
As a downstream internal service, I want structured payment state-change events published to the payments.events Kafka topic so that I can react to payment lifecycle changes without polling the Payments Service directly.

## Acceptance Criteria
- The system must publish all payment state-change events as JSON messages containing at minimum: event_type, payment_intent_id, status, schema_version, and occurred_at timestamp.
- Given a Kafka publish attempt fails, When the aiokafka producer encounters an error, Then the system must log the failure with sufficient context for debugging and must not silently drop the event without a retry attempt.
- The system must increment the schema_version field in published events whenever the event payload structure changes, ensuring backward-compatibility can be tracked by consumers.

## Effort
M

## Dependencies
- Stripe Webhook Handling and State Updates

<!-- TODO: Implement story -->
