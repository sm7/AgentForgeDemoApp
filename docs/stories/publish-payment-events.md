# Publish Payment Events

## User Story
As a developer, I want the Payment Event Publisher to publish state-change events, so that other services can react to payment updates.

## Acceptance Criteria
- The system must publish events to the Kafka topic payments.events.
- Given a payment state change, when it occurs, then the system must publish a structured event with a schema_version field.

## Effort
M

## Dependencies
- Handle Stripe Webhooks
