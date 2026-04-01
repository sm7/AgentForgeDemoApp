# Process Refunds

## User Story
As a Customer Service tool, I want to process refunds, so that I can return funds to customers when necessary.

## Acceptance Criteria
- The system must allow POST requests to /v2/refunds with valid charge details.
- Given a valid refund request, when processed, then the system must call Stripe to execute the refund and record the refund in Postgres.

## Effort
M

## Dependencies
- Create Payment Intent
