# Publish Payment Events

## User Story
As a Payments Service, I want to publish payment events, so that other systems can react to changes in payment states.

## Acceptance Criteria
- The system must publish structured JSON events to the Kafka message bus with a schema_version field.
- Given a payment state change, when it occurs, then the system must publish the corresponding event to the payments.events topic.

## Effort
M

## Dependencies
- Handle Stripe Webhooks
