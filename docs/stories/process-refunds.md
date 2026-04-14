# Process Refunds

## User Story
As a customer service agent, I want to process refunds through the Refund API, so that customers can receive their money back efficiently.

## Acceptance Criteria
- The system must validate charges before processing a refund request.
- Given a valid refund request to POST /v2/refunds, when the charge is valid, then the system must call Stripe to process the refund.

## Effort
M

## Dependencies
- Create Payment Intent
