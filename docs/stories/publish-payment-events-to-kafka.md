# Publish Payment Events to Kafka

## User Story
As a downstream consumer service, I want payment lifecycle events to be published to the payments.events Kafka topic, so that other services can react to payment state changes in near real-time.

## Acceptance Criteria
- The system must publish a structured event message to the payments.events Kafka topic for each of the following transitions: payment intent created, payment succeeded, payment failed, and refund initiated.
- Given a Kafka publish attempt fails, when the retry decorator is triggered, then the system must retry the publish at least 3 times before logging a failure and not dropping the event silently.
- The system must include payment_intent_id, event_type, timestamp, and order_id in every published event payload.

## Effort
M

## Dependencies
- Create Payment Intent
