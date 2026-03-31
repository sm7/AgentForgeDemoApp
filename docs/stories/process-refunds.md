# Process Refunds

## User Story
As a Customer Service agent, I want to submit a refund request via POST /v2/refunds, so that eligible payments can be reversed and customers are reimbursed promptly.

## Acceptance Criteria
- Given a valid refund request referencing a payment intent with status 'succeeded', when the endpoint is called, then the system must call the Stripe Refunds API and persist a refund record in Postgres with status 'pending'.
- The system must return a 422 response if the referenced payment intent does not have a status of 'succeeded' at the time of the refund request.
- Given a refund is successfully initiated, when the Stripe API call completes, then a refund event must be published to the Kafka topic payments.events.

## Effort
M

## Dependencies
- Handle Stripe Webhooks Securely
