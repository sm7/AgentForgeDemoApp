# Payment Event Publishing to Kafka

## User Story
As an internal consuming service, I want payment state-change events published to the payments.events Kafka topic, so that I can react to payment lifecycle changes without polling the Payments Service directly.

## Acceptance Criteria
- The system must publish a JSON event to the payments.events Kafka topic for every payment state change, and each event must include a schema_version field.
- Given a Kafka publish attempt fails, when the aiokafka client encounters an error, then the system must log the failure and not silently drop the event, ensuring the failure is observable for alerting or retry.
- The system must publish events in a fire-and-publish-only pattern with no consumption from the payments.events topic within this service.

## Effort
M

## Dependencies
- Stripe Webhook Handling and State Updates
