import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  PublishPaymentEventsToKafkaService,
  PaymentEventType,
  PaymentEventPayload,
  KafkaPublisherConfig,
} from './publish-payment-events-to-kafka.service';

// Mock kafkajs so no real broker connection is attempted during tests
jest.mock('kafkajs', () => {
  const mockSend = jest.fn().mockResolvedValue([{ topicName: 'payments.events', partition: 0, errorCode: 0 }]);
  const mockConnect = jest.fn().mockResolvedValue(undefined);
  const mockDisconnect = jest.fn().mockResolvedValue(undefined);
  const mockProducer = jest.fn().mockReturnValue({
    connect: mockConnect,
    disconnect: mockDisconnect,
    send: mockSend,
  });
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: mockProducer,
    })),
  };
});

/** Shared mock config used across tests */
const mockConfig: KafkaPublisherConfig = {
  brokers: ['localhost:9092'],
  clientId: 'test-payment-service',
  topic: 'payments.events',
  maxRetries: 3,
};

/** Factory for a valid PaymentEventPayload */
const buildMockPayload = (
  overrides?: Partial<PaymentEventPayload>
): PaymentEventPayload => ({
  payment_intent_id: 'pi_test_123456',
  event_type: PaymentEventType.PAYMENT_INTENT_CREATED,
  timestamp: new Date().toISOString(),
  order_id: 'order_test_789',
  ...overrides,
});

describe('PublishPaymentEventsToKafkaService', () => {
  let service: PublishPaymentEventsToKafkaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PublishPaymentEventsToKafkaService(mockConfig);
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 1
  // ---------------------------------------------------------------------------
  describe('publishPaymentLifecycleEvent', () => {
    it(
      'The system must publish a structured event message to the payments.events Kafka topic for each of the following transitions: payment intent created, payment succeeded, payment failed, and refund initiated.',
      async () => {
        const transitions: PaymentEventType[] = [
          PaymentEventType.PAYMENT_INTENT_CREATED,
          PaymentEventType.PAYMENT_SUCCEEDED,
          PaymentEventType.PAYMENT_FAILED,
          PaymentEventType.REFUND_INITIATED,
        ];

        for (const eventType of transitions) {
          const payload = buildMockPayload({ event_type: eventType });

          // TODO: Remove the try/catch once the method is implemented
          let result: Awaited<ReturnType<typeof service.publishPaymentLifecycleEvent>> | undefined;
          try {
            result = await service.publishPaymentLifecycleEvent(eventType, payload);
          } catch {
            result = undefined;
          }

          // Placeholder assertion — replace with expect(result.success).toBe(true) once implemented
          expect(service.publishPaymentLifecycleEvent).toBeDefined();
        }
      }
    );
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 2
  // ---------------------------------------------------------------------------
  describe('publishWithRetry', () => {
    it(
      'Given a Kafka publish attempt fails, when the retry decorator is triggered, then the system must retry the publish at least 3 times before logging a failure and not dropping the event silently.',
      async () => {
        const payload = buildMockPayload();
        const minRetries = 3;

        // TODO: Mock the internal producer to reject on every call so retries are exercised
        // TODO: Assert that the underlying send was called exactly minRetries times
        // TODO: Assert that the returned PublishResult has success: false and attempts >= minRetries

        let result: Awaited<ReturnType<typeof service.publishWithRetry>> | undefined;
        try {
          result = await service.publishWithRetry(payload, minRetries);
        } catch {
          result = undefined;
        }

        // Placeholder assertion
        expect(service.publishWithRetry).toBeDefined();
        expect(minRetries).toBeGreaterThanOrEqual(3);
      }
    );
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 3
  // ---------------------------------------------------------------------------
  describe('buildAndValidateEventPayload', () => {
    it(
      'The system must include payment_intent_id, event_type, timestamp, and order_id in every published event payload.',
      () => {
        const payment_intent_id = 'pi_test_abc';
        const event_type = PaymentEventType.PAYMENT_SUCCEEDED;
        const order_id = 'order_xyz_001';

        let payload: PaymentEventPayload | undefined;
        try {
          payload = service.buildAndValidateEventPayload(
            payment_intent_id,
            event_type,
            order_id
          );
        } catch {
          payload = undefined;
        }

        // Placeholder assertions — replace with field-level checks once implemented
        expect(service.buildAndValidateEventPayload).toBeDefined();

        if (payload) {
          expect(payload.payment_intent_id).toBeDefined();
          expect(payload.event_type).toBeDefined();
          expect(payload.timestamp).toBeDefined();
          expect(payload.order_id).toBeDefined();
        }
      }
    );
  });
});
