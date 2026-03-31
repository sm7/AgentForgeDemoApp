// import { Pool, QueryResult } from 'pg';
// import jwt from 'jsonwebtoken';

/**
 * Represents the shape of a payment intent record read from the
 * payment_intents Postgres table.
 */
export interface PaymentIntent {
  id: string;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Standard envelope returned by every endpoint in this service.
 */
export interface ServiceResponse<T> {
  statusCode: number;
  body: T | { error: string };
}

/**
 * @class PollPaymentIntentStatus
 *
 * Handles retrieval of payment intent status via GET /v2/payment-intents/:id.
 * Responsible for JWT validation, database look-up, and HTTP response shaping
 * so that the Orders Service can confirm payment completion before fulfilling
 * an order.
 */
export class PollPaymentIntentStatus {
  /**
   * @param dbPool  - A Postgres connection pool used to query the
   *                  payment_intents table.
   * @param jwtPublicKey - RS256 public key (PEM) used to verify bearer tokens.
   */
  constructor(
    private readonly dbPool: unknown, // Pool
    private readonly jwtPublicKey: string
  ) {}

  /**
   * Returns HTTP 200 with the current intent status and metadata for an
   * existing payment intent.
   *
   * Acceptance criterion:
   * "Given a valid RS256-signed JWT and an existing payment intent ID,
   *  When GET /v2/payment-intents/:id is called,
   *  Then the system must return HTTP 200 with the current intent status
   *  and metadata read from the payment_intents Postgres table."
   *
   * @param paymentIntentId - The UUID of the payment intent to retrieve.
   * @param bearerToken     - Raw JWT string extracted from the Authorization header.
   * @returns A ServiceResponse containing the PaymentIntent record on success.
   */
  async getPaymentIntentById(
    paymentIntentId: string,
    bearerToken: string
  ): Promise<ServiceResponse<PaymentIntent>> {
    // TODO: Verify bearerToken with RS256 public key; throw/return 401 on failure.
    // TODO: Query the payment_intents table:
    //         SELECT id, status, metadata, created_at, updated_at
    //         FROM payment_intents
    //         WHERE id = $1
    // TODO: Map the row to a PaymentIntent object.
    // TODO: Return { statusCode: 200, body: paymentIntent }.
    throw new Error('Not implemented: getPaymentIntentById');
  }

  /**
   * Returns HTTP 404 with a descriptive error message when the requested
   * payment intent does not exist in the database.
   *
   * Acceptance criterion:
   * "Given a valid JWT and a payment intent ID that does not exist,
   *  When the endpoint is called,
   *  Then the system must return HTTP 404 with a descriptive error message."
   *
   * @param paymentIntentId - The UUID that yielded no database record.
   * @returns A ServiceResponse containing a 404 status and error body.
   */
  async handleNotFound(
    paymentIntentId: string
  ): Promise<ServiceResponse<never>> {
    // TODO: Construct a standardised 404 error body, e.g.:
    //         { error: `Payment intent '${paymentIntentId}' not found.` }
    // TODO: Return { statusCode: 404, body: { error: ... } }.
    throw new Error('Not implemented: handleNotFound');
  }

  /**
   * Validates the RS256-signed JWT present on every
   * GET /v2/payment-intents/:id request, returning HTTP 401 when the token
   * is missing or invalid.
   *
   * Acceptance criterion:
   * "The system must require a valid RS256-signed JWT on every
   *  GET /v2/payment-intents/:id request, returning HTTP 401 if the token
   *  is missing or invalid."
   *
   * @param authorizationHeader - The raw value of the HTTP Authorization header
   *                              (may be undefined/null when absent).
   * @returns A ServiceResponse with statusCode 401 and an error body when
   *          authentication fails, or null when the token is valid.
   */
  async validateJwt(
    authorizationHeader: string | undefined | null
  ): Promise<ServiceResponse<never> | null> {
    // TODO: Return { statusCode: 401, body: { error: 'Authorization header missing.' } }
    //       when authorizationHeader is falsy.
    // TODO: Extract the Bearer token from the header.
    // TODO: Verify the token using jwt.verify with { algorithms: ['RS256'] }
    //       and this.jwtPublicKey.
    // TODO: Return { statusCode: 401, body: { error: 'Invalid or expired token.' } }
    //       on verification failure.
    // TODO: Return null to signal that the caller may proceed.
    throw new Error('Not implemented: validateJwt');
  }
}
