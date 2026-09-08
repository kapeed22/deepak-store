import {
  PaymentStatus,
  PaymentAttemptStatus
} from "../payment";

export const PaymentCommandType = {
  PROCESS_PAYMENT: "ProcessPayment"
} as const;

export type PaymentCommandType =
  (typeof PaymentCommandType)[keyof typeof PaymentCommandType];

export interface ProcessPaymentCommand {
  type: typeof PaymentCommandType.PROCESS_PAYMENT;

  messageId: string;

  orderId: string;
  paymentId: string;

  amount: number;
  currency: string;

  attemptNumber: number;

  createdAt: string;
}

export const PaymentEventType = {
  PAYMENT_SUCCEEDED: "PaymentSucceeded",
  PAYMENT_FAILED: "PaymentFailed",
  PAYMENT_TIMED_OUT: "PaymentTimedOut"
} as const;

export type PaymentEventType =
  (typeof PaymentEventType)[keyof typeof PaymentEventType];

export interface PaymentSucceededEvent {
  type: typeof PaymentEventType.PAYMENT_SUCCEEDED;

  eventId: string;

  orderId: string;
  paymentId: string;

  provider: string;
  providerPaymentId: string;

  amount: number;
  currency: string;

  attemptNumber: number;

  occurredAt: string;
}

export interface PaymentFailedEvent {
  type: typeof PaymentEventType.PAYMENT_FAILED;

  eventId: string;

  orderId: string;
  paymentId: string;

  provider: string;

  attemptNumber: number;

  status: PaymentStatus.FAILED;

  errorCode?: string;
  errorMessage?: string;

  occurredAt: string;
}

export interface PaymentTimedOutEvent {
  type: typeof PaymentEventType.PAYMENT_TIMED_OUT;

  eventId: string;

  orderId: string;
  paymentId: string;

  provider: string;

  attemptNumber: number;

  status: PaymentAttemptStatus.TIMED_OUT;

  occurredAt: string;
}

export type PaymentEvent =
  | PaymentSucceededEvent
  | PaymentFailedEvent
  | PaymentTimedOutEvent;
