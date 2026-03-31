// import { Pool, QueryResult } from 'pg';
// import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Represents the current state of a payment intent as stored in Postgres.
 */
export interface PaymentIntentState {
  id: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * Represents a standardised HTTP-style service response.
 */
export interface ServiceResponse<T = unknown> {
  statusCode: number;
  body?: T;
  error?: string;
}

/**
 * @class PaymentStatusPolling
 * @description Handles retrieval of the current state of a payment intent
 * via GET /v2/payment-intents/:id. Validates RS256 JWTs and queries Postgres
 * to reflect accurate payment status in order workflows.
 *
 * Depends on: Payment Intent Creation
 */
export class PaymentStatusPolling {
  // private db: Pool;
  // private jwtPublicKey: string;

  constructor(
    // db: Pool,
    // jwtPublicKey: string
  ) {
    // this.db = db;
    // this.jwtPublicKey = jwtPublicKey;
  }

  /**
   * @method getPaymentIntentById
   * @description
   * Acceptance Criterion 1:
   * Given a GET /v2/payment-intents/:id request is received with a valid RS256 JWT,
   * when the payment intent ID exists in Postgres,
   * then the system must return the current intent state with a 200 response.
   *
   * @param {string} paymentIntentId - The unique identifier of the payment intent.
   * @param {string} authToken - The RS256 JWT bearer token from the request.
   * @returns {Promise<ServiceResponse<PaymentIntentState>>} 200 with intent state if found.
   */
  async getPaymentIntentById(
    paymentIntentId: string,
    authToken: string
  ): Promise<ServiceResponse<PaymentIntentState>> {
    // TODO: Validate the RS256 JWT using this.jwtPublicKey.
    // TODO: Query Postgres for the payment intent by paymentIntentId.
    // TODO: If found, return { statusCode: 200, body: <PaymentIntentState> }.
    throw new Error('Not implemented: getPaymentIntentById');
  }

  /**
   * @method getPaymentIntentNotFound
   * @description
   * Acceptance Criterion 2:
   * Given a GET /v2/payment-intents/:id request is received with a valid RS256 JWT,
   * when the payment intent ID does not exist,
   * then the system must return a 404 response.
   *
   * @param {string} paymentIntentId - The unique identifier of the payment intent.
   * @param {string} authToken - The RS256 JWT bearer token from the request.
   * @returns {Promise<ServiceResponse>} 404 response when the intent is not found.
   */
  async getPaymentIntentNotFound(
    paymentIntentId: string,
    authToken: string
  ): Promise<ServiceResponse> {
    // TODO: Validate the RS256 JWT using this.jwtPublicKey.
    // TODO: Query Postgres for the payment intent by paymentIntentId.
    // TODO: If not found, return { statusCode: 404, error: 'Payment intent not found' }.
    throw new Error('Not implemented: getPaymentIntentNotFound');
  }

  /**
   * @method rejectRequestWithoutValidJwt
   * @description
   * Acceptance Criterion 3:
   * Given a GET /v2/payment-intents/:id request is received without a valid RS256 JWT,
   * when the service validates the token,
   * then the system must reject the request with a 401 Unauthorized response.
   *
   * @param {string} paymentIntentId - The unique identifier of the payment intent.
   * @param {string | undefined} authToken - The bearer token from the request (may be missing or invalid).
   * @returns {Promise<ServiceResponse>} 401 response when the JWT is absent or invalid.
   */
  async rejectRequestWithoutValidJwt(
    paymentIntentId: string,
    authToken: string | undefined
  ): Promise<ServiceResponse> {
    // TODO: Attempt to verify the RS256 JWT using this.jwtPublicKey.
    // TODO: If verification fails (missing, expired, wrong algorithm, bad signature),
    //       return { statusCode: 401, error: 'Unauthorized' }.
    throw new Error('Not implemented: rejectRequestWithoutValidJwt');
  }
}
