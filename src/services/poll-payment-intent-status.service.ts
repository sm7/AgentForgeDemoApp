// import { Pool } from 'pg';
// import jwt from 'jsonwebtoken';

/**
 * Represents the shape of a payment intent record returned by the service.
 */
export interface PaymentIntentStatusResult {
  payment_intent_id: string;
  status: string;
  last_updated: Date;
}

/**
 * Represents a standardised service response envelope.
 */
export interface ServiceResponse<T> {
  statusCode: number;
  body?: T;
  error?: string;
}

/**
 * @class PollPaymentIntentStatus
 *
 * @description
 * Service responsible for retrieving the current status of a payment intent
 * via GET /v2/payment-intents/:id.  Allows the Orders Service to reflect
 * accurate payment state to customers without relying solely on webhooks.
 *
 * User Story:
 *   As the Orders Service, I want to retrieve the current status of a payment
 *   intent via GET /v2/payment-intents/:id, so that I can reflect accurate
 *   payment state to customers without relying solely on webhooks.
 *
 * Dependencies: Create Payment Intent
 */
export class PollPaymentIntentStatus {
  // private db: Pool;
  // private jwtSecret: string;

  constructor(/* db: Pool, jwtSecret: string */) {
    // TODO: inject Postgres pool and JWT secret via constructor
    // this.db = db;
    // this.jwtSecret = jwtSecret;
  }

  /**
   * @method getPaymentIntentStatus
   *
   * @description
   * Acceptance Criterion:
   *   "Given a valid payment_intent_id and a valid JWT, when the endpoint is
   *   called, then the system must return a 200 response containing the
   *   payment_intent_id, current status, and last updated timestamp."
   *
   * Validates the supplied JWT, queries Postgres for the payment intent record
   * identified by `paymentIntentId`, and returns a 200 response containing
   * the payment_intent_id, current status, and last_updated timestamp.
   *
   * @param paymentIntentId - The UUID of the payment intent to retrieve.
   * @param jwtToken        - A valid shared JWT authorising the request.
   * @returns A ServiceResponse with HTTP 200 and the payment intent details.
   */
  async getPaymentIntentStatus(
    paymentIntentId: string,
    jwtToken: string
  ): Promise<ServiceResponse<PaymentIntentStatusResult>> {
    // TODO: verify jwtToken using this.jwtSecret; throw/return 401 if invalid
    // TODO: query Postgres: SELECT payment_intent_id, status, updated_at
    //       FROM payment_intents WHERE payment_intent_id = $1
    // TODO: map the row to PaymentIntentStatusResult and return statusCode 200
    throw new Error('Not implemented');
  }

  /**
   * @method handlePaymentIntentNotFound
   *
   * @description
   * Acceptance Criterion:
   *   "The system must return a 404 response when the requested
   *   payment_intent_id does not exist in Postgres."
   *
   * Called internally (or by the controller) when the Postgres query returns
   * no rows for the supplied `paymentIntentId`.  Returns a standardised 404
   * error response.
   *
   * @param paymentIntentId - The UUID that was not found in the database.
   * @returns A ServiceResponse with HTTP 404 and a descriptive error message.
   */
  handlePaymentIntentNotFound(
    paymentIntentId: string
  ): ServiceResponse<never> {
    // TODO: construct and return a 404 ServiceResponse
    // e.g. { statusCode: 404, error: `Payment intent ${paymentIntentId} not found` }
    throw new Error('Not implemented');
  }

  /**
   * @method handleUnauthorizedRequest
   *
   * @description
   * Acceptance Criterion:
   *   "The system must return a 401 response if the request does not include
   *   a valid shared JWT."
   *
   * Validates the supplied `jwtToken`.  When the token is absent, malformed,
   * expired, or signed with the wrong secret, returns a standardised 401
   * error response.
   *
   * @param jwtToken - The JWT string extracted from the Authorization header
   *                   (may be undefined/null when the header is missing).
   * @returns A ServiceResponse with HTTP 401 and a descriptive error message.
   */
  handleUnauthorizedRequest(
    jwtToken: string | undefined | null
  ): ServiceResponse<never> {
    // TODO: attempt jwt.verify(jwtToken, this.jwtSecret)
    // TODO: catch JsonWebTokenError / TokenExpiredError and return 401
    // e.g. { statusCode: 401, error: 'Unauthorized: invalid or missing JWT' }
    throw new Error('Not implemented');
  }
}
