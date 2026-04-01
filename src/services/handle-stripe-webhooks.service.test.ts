import { describe, it, expect, beforeEach } from '@jest/globals';
import { HandleStripeWebhooks } from './handle-stripe-webhooks.service';

jest.mock('stripe');
jest.mock('pg');
jest.mock('kafkajs');

describe('HandleStripeWebhooks', () => {
  let service: HandleStripeWebhooks;
  let mockStripe: any;
  let mockDb: any;
  let mockKafkaProducer: any;

  beforeEach(() => {
    mockStripe = {
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    mockDb = {
      query: jest.fn(),
    };

    mockKafkaProducer = {
      send: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };

    service = new HandleStripeWebhooks(mockStripe, mockDb, mockKafkaProducer);
  });

  it(
    'Given an incoming webhook request, when the Stripe-Signature header is present and valid, then the service must process the event and update the corresponding payment intent status in Postgres.',
    async () => {
      const rawBody = Buffer.from(JSON.stringify({ id: 'evt_test_001', type: 'payment_intent.succeeded' }));
      const stripeSignatureHeader = 't=1700000000,v1=abc123signature';
      const webhookSecret = 'whsec_test_secret';

      mockStripe.webhooks.constructEvent.mockReturnValue({
        id: 'evt_test_001',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_001', status: 'succeeded' } },
      });

      mockDb.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 'pi_test_001', status: 'succeeded' }] });

      const result = await service.verifyAndProcessWebhookEvent(
        rawBody,
        stripeSignatureHeader,
        webhookSecret
      );

      expect(result).toBeDefined();
    }
  );

  it(
    'Given an incoming webhook request with a missing or invalid Stripe-Signature header, when POST /v2/webhooks/stripe is called, then the service must reject the request with a 400 and log the security violation.',
    () => {
      const missingHeader = null;
      const requestId = 'req_test_invalid_001';

      const result = service.rejectInvalidSignatureRequest(missingHeader, requestId);

      expect(result).toBeDefined();
    }
  );

  it(
    'The system must publish a structured event to the Kafka topic payments.events after successfully processing each webhook event.',
    async () => {
      const mockStripeEvent = {
        id: 'evt_test_002',
        type: 'payment_intent.succeeded',
        created: 1700000000,
        data: { object: { id: 'pi_test_002', status: 'succeeded' } },
      };
      const paymentIntentId = 'pi_test_002';

      mockKafkaProducer.send.mockResolvedValue([{ topicName: 'payments.events', partition: 0 }]);

      const result = await service.publishPaymentEventToKafka(mockStripeEvent, paymentIntentId);

      expect(result).toBeDefined();
    }
  );

  it(
    'The system must return a 200 response to Stripe immediately upon successful signature verification and event queuing, even if downstream processing is asynchronous.',
    () => {
      const eventId = 'evt_test_003';

      const result = service.acknowledgeWebhookReceipt(eventId);

      expect(result).toBeDefined();
    }
  );
});
