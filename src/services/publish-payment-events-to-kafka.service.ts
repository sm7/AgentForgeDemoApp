// import { Kafka, Producer, RecordMetadata } from 'kafkajs';

/**
 * Enum representing the supported payment lifecycle event types
 * published to the payments.events Kafka topic.
 */
export enum PaymentEventType {
  PAYMENT_INTENT_CREATED = 'payment_intent_created',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED = 'payment_failed',
  REFUND_INITIATED = 'refund_initiated',
}

/**
 * Structured payload for every event published to the payments.events topic.
 * Acceptance Criterion: The system must include payment_intent_id, event_type,
 * timestamp, and order_id in every published event payload.
 */
export interface PaymentEventPayload {
  payment_intent_id: string;
  event_type: PaymentEventType;
  timestamp: string;
  order_id: string;
  [key: string]: unknown;
}

/**
 * Result returned after a publish attempt, including retry metadata.
 */
export interface PublishResult {
  success: boolean;
  topic: string;
  payload: PaymentEventPayload;
  attempts: number;
  error?: Error;
}

/**
 * Configuration options for the Kafka producer used by this service.
 */
export interface KafkaPublisherConfig {
  brokers: string[];
  clientId: string;
  topic: string;
  maxRetries: number;
}

const DEFAULT_TOPIC = 'payments.events';
const DEFAULT_MAX_RETRIES = 3;

/**
 * @class PublishPaymentEventsToKafkaService
 *
 * Responsible for publishing structured payment lifecycle events to the
 * `payments.events` Kafka topic so that downstream consumer services can
 * react to payment state changes in near real-time.
 *
 * Covers acceptance criteria:
 *  1. Publish structured event messages for all payment lifecycle transitions.
 *  2. Retry failed publish attempts at least 3 times before logging failure.
 *  3. Ensure every payload includes payment_intent_id, event_type, timestamp, and order_id.
 */
export class PublishPaymentEventsToKafkaService {
  private readonly topic: string;
  private readonly maxRetries: number;
  // private producer: Producer;

  constructor(config?: Partial<KafkaPublisherConfig>) {
    this.topic = config?.topic ?? DEFAULT_TOPIC;
    this.maxRetries = config?.maxRetries ?? DEFAULT_MAX_RETRIES;
    // TODO: Initialise Kafka producer using config.brokers and config.clientId
  }

  /**
   * Publishes a structured event message to the payments.events Kafka topic
   * for each of the following transitions: payment intent created, payment
   * succeeded, payment failed, and refund initiated.
   *
   * Acceptance Criterion: "The system must publish a structured event message
   * to the payments.events Kafka topic for each of the following transitions:
   * payment intent created, payment succeeded, payment failed, and refund initiated."
   *
   * @param eventType - The payment lifecycle transition type.
   * @param payload   - The structured event payload to publish.
   * @returns A promise resolving to a PublishResult indicating success or failure.
   */
  async publishPaymentLifecycleEvent(
    eventType: PaymentEventType,
    payload: PaymentEventPayload
  ): Promise<PublishResult> {
    // TODO: Validate that eventType is one of the four supported transitions.
    // TODO: Serialise payload to JSON and produce a message to this.topic via the Kafka producer.
    // TODO: Return a PublishResult with success: true and attempts: 1 on first-attempt success.
    throw new Error('Not implemented: publishPaymentLifecycleEvent');
  }

  /**
   * Wraps a Kafka publish attempt with a retry mechanism. If the publish fails,
   * the operation is retried up to `maxRetries` times (minimum 3). After all
   * retries are exhausted the failure is logged and the event is NOT silently dropped.
   *
   * Acceptance Criterion: "Given a Kafka publish attempt fails, when the retry
   * decorator is triggered, then the system must retry the publish at least 3
   * times before logging a failure and not dropping the event silently."
   *
   * @param payload     - The structured event payload to publish.
   * @param maxAttempts - Maximum number of publish attempts (must be >= 3).
   * @returns A promise resolving to a PublishResult that includes the attempt count.
   */
  async publishWithRetry(
    payload: PaymentEventPayload,
    maxAttempts: number = this.maxRetries
  ): Promise<PublishResult> {
    // TODO: Enforce that maxAttempts is at least 3.
    // TODO: Implement exponential back-off between retry attempts.
    // TODO: On final failure, log the error with full payload context.
    // TODO: Never swallow the error silently — surface it in the returned PublishResult.
    throw new Error('Not implemented: publishWithRetry');
  }

  /**
   * Builds and validates a PaymentEventPayload, ensuring the four mandatory
   * fields (payment_intent_id, event_type, timestamp, order_id) are present
   * and non-empty before the event is published.
   *
   * Acceptance Criterion: "The system must include payment_intent_id, event_type,
   * timestamp, and order_id in every published event payload."
   *
   * @param payment_intent_id - Unique identifier for the payment intent.
   * @param event_type        - The payment lifecycle event type.
   * @param order_id          - The order associated with this payment event.
   * @param extras            - Optional additional fields to merge into the payload.
   * @returns A fully validated PaymentEventPayload ready for publishing.
   * @throws Error if any mandatory field is missing or empty.
   */
  buildAndValidateEventPayload(
    payment_intent_id: string,
    event_type: PaymentEventType,
    order_id: string,
    extras?: Record<string, unknown>
  ): PaymentEventPayload {
    // TODO: Validate that payment_intent_id, event_type, and order_id are non-empty strings.
    // TODO: Generate an ISO-8601 timestamp for the current moment.
    // TODO: Merge extras into the payload without overwriting mandatory fields.
    // TODO: Return the complete, validated PaymentEventPayload.
    throw new Error('Not implemented: buildAndValidateEventPayload');
  }
}
