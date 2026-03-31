// import Stripe from 'stripe';
// import { Pool, PoolClient } from 'pg';
// import { Kafka, Producer } from 'kafkajs';

/**
 * Represents a payment intent record stored in Postgres.
 */
export interface InternalPaymentIntent {
  id: string;
  stripePaymentIntentId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuration options for the reconciliation worker.
 */
export interface ReconciliationWorkerConfig {
  /** How many minutes a payment intent must remain in a non-terminal status before it is eligible for reconciliation. */
  staleThresholdMinutes: number;
  /** Non-terminal statuses that should be reconciled. */
  nonTerminalStatuses: string[];
  /** Kafka topic to publish corrective events to. */
  paymentEventsTopic: string;
}

/**
 * Summary produced after each reconciliation run.
 */
export interface ReconciliationRunSummary {
  checkedCount: number;
  updatedCount: number;
  errors: Array<{ paymentIntentId: string; error: string }>;
  ranAt: Date;
}

/**
 * Corrective event payload published to payments.events when a discrepancy is resolved.
 */
export interface CorrectivePaymentEvent {
  eventType: 'RECONCILIATION_CORRECTION';
  paymentIntentId: string;
  previousStatus: string;
  correctedStatus: string;
  correctedAt: string;
}

/**
 * @class ReconciliationWorkerForPaymentState
 *
 * Periodically compares internal Postgres payment records against Stripe's
 * authoritative state. Detects and corrects discrepancies caused by missed
 * webhooks or processing failures.
 *
 * Dependencies:
 *  - Handle Stripe Webhooks Securely
 *  - Publish Payment Events to Kafka
 */
export class ReconciliationWorkerForPaymentState {
  private readonly config: ReconciliationWorkerConfig;
  // private readonly db: Pool;
  // private readonly stripe: Stripe;
  // private readonly kafkaProducer: Producer;

  constructor(
    config: ReconciliationWorkerConfig,
    // db: Pool,
    // stripe: Stripe,
    // kafkaProducer: Producer,
  ) {
    this.config = config;
    // this.db = db;
    // this.stripe = stripe;
    // this.kafkaProducer = kafkaProducer;
  }

  /**
   * Queries Postgres for payment intents that have remained in a non-terminal
   * status (e.g. 'created' or 'processing') beyond the configurable threshold
   * and cross-checks their status against the Stripe API.
   *
   * Acceptance Criterion:
   *   "The system must query Postgres for payment intents that have remained in
   *   a non-terminal status (e.g. 'created' or 'processing') beyond a
   *   configurable threshold and cross-check their status against the Stripe API."
   *
   * @param thresholdMinutes - Number of minutes a record must be stale before it is eligible.
   * @param nonTerminalStatuses - List of statuses considered non-terminal.
   * @returns A list of internal payment intent records eligible for reconciliation,
   *          each paired with the current Stripe status.
   */
  async queryAndCrossCheckStalePaymentIntents(
    thresholdMinutes: number,
    nonTerminalStatuses: string[],
  ): Promise<Array<{ internal: InternalPaymentIntent; stripeStatus: string }>> {
    // TODO: Calculate the cutoff timestamp: now - thresholdMinutes.
    // TODO: Query Postgres for records WHERE status IN (nonTerminalStatuses)
    //       AND updated_at < cutoffTimestamp.
    // TODO: For each record, call stripe.paymentIntents.retrieve(record.stripePaymentIntentId)
    //       to obtain the current Stripe status.
    // TODO: Return an array of { internal, stripeStatus } pairs for all retrieved records.
    throw new Error('Not implemented: queryAndCrossCheckStalePaymentIntents');
  }

  /**
   * Given a discrepancy between the internal Postgres status and the Stripe API
   * status, updates the Postgres record to match the Stripe status and publishes
   * a corrective event to the payments.events Kafka topic.
   *
   * Acceptance Criterion:
   *   "Given a discrepancy is found between the internal Postgres status and the
   *   Stripe API status, when the worker runs, then the Postgres record must be
   *   updated to match the Stripe status and a corrective event must be published
   *   to payments.events."
   *
   * @param internalRecord - The internal payment intent record with the stale status.
   * @param stripeStatus - The authoritative status returned by the Stripe API.
   * @returns The corrective event that was published, or null if no discrepancy existed.
   */
  async reconcileDiscrepancyAndPublishCorrectiveEvent(
    internalRecord: InternalPaymentIntent,
    stripeStatus: string,
  ): Promise<CorrectivePaymentEvent | null> {
    // TODO: Compare internalRecord.status with stripeStatus.
    // TODO: If they match, return null (no discrepancy).
    // TODO: Begin a Postgres transaction.
    // TODO: UPDATE payment_intents SET status = stripeStatus, updated_at = NOW()
    //       WHERE id = internalRecord.id.
    // TODO: Build a CorrectivePaymentEvent payload.
    // TODO: Publish the event to this.config.paymentEventsTopic via kafkaProducer.send(...).
    // TODO: Commit the transaction.
    // TODO: Return the published corrective event.
    // TODO: On error, rollback the transaction and rethrow.
    throw new Error('Not implemented: reconcileDiscrepancyAndPublishCorrectiveEvent');
  }

  /**
   * Logs a structured summary after each reconciliation run, including the
   * number of records checked, updated, and any errors encountered.
   *
   * Acceptance Criterion:
   *   "The system must log a structured summary after each reconciliation run
   *   including the number of records checked, updated, and any errors encountered."
   *
   * @param summary - The reconciliation run summary to log.
   * @returns void
   */
  logReconciliationRunSummary(summary: ReconciliationRunSummary): void {
    // TODO: Serialize the summary object to a structured JSON log entry.
    // TODO: Include fields: ranAt, checkedCount, updatedCount, errorCount, errors.
    // TODO: Emit via the application logger at INFO level (or ERROR if errors.length > 0).
    throw new Error('Not implemented: logReconciliationRunSummary');
  }

  /**
   * Orchestrates a full reconciliation run:
   *  1. Queries and cross-checks stale payment intents.
   *  2. Reconciles each discrepancy and publishes corrective events.
   *  3. Logs the structured run summary.
   *
   * @returns The summary of the completed reconciliation run.
   */
  async run(): Promise<ReconciliationRunSummary> {
    // TODO: Call queryAndCrossCheckStalePaymentIntents with config values.
    // TODO: Iterate over results; for each pair call reconcileDiscrepancyAndPublishCorrectiveEvent.
    // TODO: Track checkedCount, updatedCount, and errors.
    // TODO: Build a ReconciliationRunSummary and call logReconciliationRunSummary.
    // TODO: Return the summary.
    throw new Error('Not implemented: run');
  }
}
