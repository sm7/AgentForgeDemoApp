// import { Kafka, Producer } from 'kafkajs';

/**
 * PaymentEvent represents the structured payload published to Kafka.
 */
export interface PaymentEvent {
  schema_version: string;
  event_id: string;
  payment_id: string;
  state: string;
  occurred_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * PublishPaymentEventsService
 *
 * Implements the Payment Event Publisher responsible for publishing
 * payment state-change events to Kafka so that downstream services
 * can react to payment updates.
 *
 * @see user_story: "As a developer, I want the Payment Event Publisher to publish
 * state-change events, so that other services can react to payment updates."
 */
export class PublishPaymentEventsService {
  private readonly kafkaTopic: string = 'payments.events';

  constructor(
    // private readonly producer: Producer
  ) {}

  /**
   * publishEventsToKafkaTopic
   *
   * Acceptance Criterion: "The system must publish events to the Kafka topic payments.events."
   *
   * Publishes a payment event payload to the Kafka topic `payments.events`.
   *
   * @param event - The structured payment event to publish.
   * @returns A promise that resolves to void when the event has been published.
   */
  async publishEventsToKafkaTopic(event: PaymentEvent): Promise<void> {
    // TODO: Validate that this.kafkaTopic === 'payments.events'
    // TODO: Serialize the event payload to JSON
    // TODO: await this.producer.send({
    //   topic: this.kafkaTopic,
    //   messages: [{ key: event.payment_id, value: JSON.stringify(event) }],
    // });
    throw new Error('Not implemented: publishEventsToKafkaTopic');
  }

  /**
   * publishStructuredEventWithSchemaVersion
   *
   * Acceptance Criterion: "Given a payment state change, when it occurs, then the
   * system must publish a structured event with a schema_version field."
   *
   * Constructs and publishes a structured event that includes a `schema_version`
   * field whenever a payment state change is detected.
   *
   * @param paymentId - The unique identifier of the payment whose state changed.
   * @param newState - The new state of the payment (e.g. 'succeeded', 'failed').
   * @param schemaVersion - The schema version string to embed in the event (e.g. '1.0.0').
   * @param metadata - Optional additional metadata to include in the event.
   * @returns A promise that resolves to the constructed and published PaymentEvent.
   */
  async publishStructuredEventWithSchemaVersion(
    paymentId: string,
    newState: string,
    schemaVersion: string,
    metadata?: Record<string, unknown>
  ): Promise<PaymentEvent> {
    // TODO: Generate a unique event_id (e.g. using uuid)
    // TODO: Construct the PaymentEvent object with schema_version set to schemaVersion
    // TODO: Call this.publishEventsToKafkaTopic(event) to dispatch the event
    // TODO: Return the constructed event
    throw new Error('Not implemented: publishStructuredEventWithSchemaVersion');
  }
}
