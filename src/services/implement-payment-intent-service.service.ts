import { Request, Response } from 'express';
// import { Client } from 'pg';

/**
 * Implements the Payment Intent Service.
 */
export class ImplementPaymentIntentService {
  /**
   * Handles POST requests to /v2/payment-intents and creates a payment intent in the Postgres database.
   * @param req Express request object
   * @param res Express response object
   */
  public async handlePostRequest(req: Request, res: Response): Promise<void> {
    // TODO: Implement the logic to create a payment intent in the Postgres database
  }

  /**
   * Returns a 201 status code with the payment intent details given a valid request.
   * @param req Express request object
   * @param res Express response object
   */
  public async returnPaymentIntentDetails(req: Request, res: Response): Promise<void> {
    // TODO: Implement the logic to return a 201 status code with payment intent details
  }
}
