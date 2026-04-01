// import { Kafka, Producer, RecordMetadata } from 'kafkajs';

/**
 * Represents a structured payment event published to Kafka.
 */
export interface PaymentEvent {
  schema_version: string;
  event_id: string;
  event_type: string;
  payment_id: string;
  state: string;
  occurred_at: string;
  payload: Record<string, unknown>;
}

/**
 * Result returned after publishing an event to Kafka.
 */
export interface PublishResult {
  topic: string;
  partition: number;
  offset: string;
  event_id: string;
}

/**
 * @class PublishPaymentEvents
 * @description Service responsible for publishing payment events to the Kafka
 * message bus so that downstream systems can react to changes in payment states.
 *
 * User Story: As a Payments Service, I want to publish payment events,
 * so that other systems can react to changes in payment states.
 *
 * Dependencies: Handle Stripe Webhooks
 */
export class PublishPaymentEvents {
  private readonly PAYMENTS_TOPIC = 'payments.events';
  private readonly SCHEMA_VERSION = '1.0.0';

  // private producer: Producer;

  constructor(
    // producer: Producer
  ) {
    // TODO: Inject and initialise the Kafka producer.
    // this.producer = producer;
  }

  /**
   * @method publishStructuredJsonEventWithSchemaVersion
   * @description Publishes a structured JSON event to the Kafka message bus.
   * The event envelope always includes a `schema_version` field so that
   * consumers can perform schema-based validation and evolution.
   *
   * Acceptance Criterion:
   *   "The system must publish structured JSON events to the Kafka message bus
   *    with a schema_version field."
   *
   * @param eventType  - A string identifier for the event type (e.g. 'payment.created').
   * @param paymentId  - The unique identifier of the payment being described.
   * @param state      - The current state of the payment (e.g. 'succeeded', 'failed').
   * @param payload    - Arbitrary additional data to include in the event body.
   * @returns A promise that resolves to the {@link PublishResult} from Kafka.
   */
  async publishStructuredJsonEventWithSchemaVersion(
    eventType: string,
    paymentId: string,
    state: string,
    payload: Record<string, unknown> = {}
  ): Promise<PublishResult> {
    // TODO: Build the structured event envelope.
    const event: PaymentEvent = {
      schema_version: this.SCHEMA_VERSION,
      event_id: '', // TODO: Generate a UUID (e.g. crypto.randomUUID()).
      event_type: eventType,
      payment_id: paymentId,
      state,
      occurred_at: new Date().toISOString(),
      payload,
    };

    // TODO: Serialise the event to JSON and send it via the Kafka producer.
    // const recordMetadata: RecordMetadata[] = await this.producer.send({
    //   topic: this.PAYMENTS_TOPIC,
    //   messages: [{ key: paymentId, value: JSON.stringify(event) }],
    // });

    // TODO: Map RecordMetadata to PublishResult and return.
    throw new Error('publishStructuredJsonEventWithSchemaVersion: not yet implemented');
  }

  /**
   * @method publishPaymentStateChangeEvent
   * @description Reacts to a payment state change and publishes the corresponding
   * event to the `payments.events` Kafka topic, ensuring all downstream consumers
   * are notified in near-real-time.
   *
   * Acceptance Criterion:
   *   "Given a payment state change, when it occurs, then the system must publish
   *    the corresponding event to the payments.events topic."
   *
   * @param paymentId   - The unique identifier of the payment whose state changed.
   * @param newState    - The new state the payment has transitioned to.
   * @param previousState - The state the payment was in before the transition.
   * @param metadata    - Optional extra metadata to attach to the event payload.
   * @returns A promise that resolves to the {@link PublishResult} from Kafka.
   */
  async publishPaymentStateChangeEvent(
    paymentId: string,
    newState: string,
    previousState: string,
    metadata: Record<string, unknown> = {}
  ): Promise<PublishResult> {
    // TODO: Derive the event type from the new state (e.g. 'payment.succeeded').
    const eventType = `payment.${newState}`;

    // TODO: Delegate to publishStructuredJsonEventWithSchemaVersion, passing the
    //       state transition details in the payload.
    const payload: Record<string, unknown> = {
      previous_state: previousState,
      ...metadata,
    };

    return this.publishStructuredJsonEventWithSchemaVersion(
      eventType,
      paymentId,
      newState,
      payload
    );
  }
}
