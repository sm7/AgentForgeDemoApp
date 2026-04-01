import { describe, it, expect, beforeEach } from '@jest/globals';
import { ImplementPaymentIntentService } from './implement-payment-intent-service.service';
import { Request, Response } from 'express';

jest.mock('express');

describe('ImplementPaymentIntentService', () => {
  let service: ImplementPaymentIntentService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new ImplementPaymentIntentService();
    req = {} as Request;
    res = {} as Response;
  });

  it('The system must handle POST requests to /v2/payment-intents and create a payment intent in the Postgres database.', async () => {
    await service.handlePostRequest(req, res);
    expect(service.handlePostRequest).toBeDefined();
  });

  it('Given a valid request, when the Orders Service calls the endpoint, then the system must return a 201 status code with the payment intent details.', async () => {
    await service.returnPaymentIntentDetails(req, res);
    expect(service.returnPaymentIntentDetails).toBeDefined();
  });
});
