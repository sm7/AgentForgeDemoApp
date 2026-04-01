import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the Kafka producer module before importing the service.
jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue([
        { topicName: 'payments.events', partition: 0, baseOffset: '42' },
      ]),
    }),
  })),
}));

import {
  PublishPaymentEvents,
  PaymentEvent,
  PublishResult,
} from './publish-payment-events.service';

describe('PublishPaymentEvents', () => {
  let service: PublishPaymentEvents;

  beforeEach(() => {
    jest.clearAllMocks();
    // TODO: Pass a mocked Kafka producer instance once the constructor accepts one.
    service = new PublishPaymentEvents();
  });

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 1
  // ---------------------------------------------------------------------------
  it(
    'The system must publish structured JSON events to the Kafka message bus with a schema_version field.',
    async () => {
      // Arrange
      const eventType = 'payment.created';
      const paymentId = 'pay_test_001';
      const state = 'created';
      const payload = { amount: 5000, currency: 'usd' };

      // Act
      // TODO: Remove the try/catch once the method is implemented.
      let result: PublishResult | undefined;
      try {
        result = await service.publishStructuredJsonEventWithSchemaVersion(
          eventType,
          paymentId,
          state,
          payload
        );
      } catch {
        // Expected until the method body is implemented.
      }

      // Assert
      // Once implemented, replace with: expect(result).toBeDefined();
      // and: expect(result?.topic).toBe('payments.events');
      expect(service.publishStructuredJsonEventWithSchemaVersion).toBeDefined();
    }
  );

  // ---------------------------------------------------------------------------
  // Acceptance Criterion 2
  // ---------------------------------------------------------------------------
  it(
    'Given a payment state change, when it occurs, then the system must publish the corresponding event to the payments.events topic.',
    async () => {
      // Arrange
      const paymentId = 'pay_test_002';
      const newState = 'succeeded';
      const previousState = 'processing';
      const metadata = { stripe_charge_id: 'ch_test_abc123' };

      // Act
      // TODO: Remove the try/catch once the method is implemented.
      let result: PublishResult | undefined;
      try {
        result = await service.publishPaymentStateChangeEvent(
          paymentId,
          newState,
          previousState,
          metadata
        );
      } catch {
        // Expected until the method body is implemented.
      }

      // Assert
      // Once implemented, replace with:
      // expect(result).toBeDefined();
      // expect(result?.topic).toBe('payments.events');
      expect(service.publishPaymentStateChangeEvent).toBeDefined();
    }
  );
});
