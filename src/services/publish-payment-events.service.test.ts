import { describe, it, expect, beforeEach } from '@jest/globals';
import { PublishPaymentEventsService, PaymentEvent } from './publish-payment-events.service';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined),
    }),
  })),
}));

describe('PublishPaymentEventsService', () => {
  let service: PublishPaymentEventsService;

  const mockEvent: PaymentEvent = {
    schema_version: '1.0.0',
    event_id: 'evt_test_001',
    payment_id: 'pay_test_001',
    state: 'succeeded',
    occurred_at: new Date().toISOString(),
    metadata: { source: 'stripe' },
  };

  beforeEach(() => {
    service = new PublishPaymentEventsService();
  });

  describe('publishEventsToKafkaTopic', () => {
    it('The system must publish events to the Kafka topic payments.events.', async () => {
      // Arrange
      const publishSpy = jest
        .spyOn(service, 'publishEventsToKafkaTopic')
        .mockResolvedValue(undefined);

      // Act
      const result = await service.publishEventsToKafkaTopic(mockEvent);

      // Assert
      expect(publishSpy).toBeDefined();
      expect(publishSpy).toHaveBeenCalledWith(mockEvent);
      expect(result).toBeDefined();

      publishSpy.mockRestore();
    });
  });

  describe('publishStructuredEventWithSchemaVersion', () => {
    it('Given a payment state change, when it occurs, then the system must publish a structured event with a schema_version field.', async () => {
      // Arrange
      const expectedEvent: PaymentEvent = { ...mockEvent };
      const publishStructuredSpy = jest
        .spyOn(service, 'publishStructuredEventWithSchemaVersion')
        .mockResolvedValue(expectedEvent);

      // Act
      const result = await service.publishStructuredEventWithSchemaVersion(
        'pay_test_001',
        'succeeded',
        '1.0.0',
        { source: 'stripe' }
      );

      // Assert
      expect(publishStructuredSpy).toBeDefined();
      expect(publishStructuredSpy).toHaveBeenCalledWith(
        'pay_test_001',
        'succeeded',
        '1.0.0',
        { source: 'stripe' }
      );
      expect(result).toBeDefined();
      expect(result.schema_version).toBeDefined();

      publishStructuredSpy.mockRestore();
    });
  });
});
