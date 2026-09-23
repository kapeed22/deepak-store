import { PaymentAttemptStatus, PaymentStatus } from "../payment";
export declare const PaymentCommandType: {
    readonly PROCESS_PAYMENT: "ProcessPayment";
};
export type PaymentCommandType = (typeof PaymentCommandType)[keyof typeof PaymentCommandType];
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
export declare const PaymentEventType: {
    readonly PAYMENT_SUCCEEDED: "PaymentSucceeded";
    readonly PAYMENT_FAILED: "PaymentFailed";
    readonly PAYMENT_TIMED_OUT: "PaymentTimedOut";
};
export type PaymentEventType = (typeof PaymentEventType)[keyof typeof PaymentEventType];
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
    status: PaymentStatus;
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
    status: PaymentAttemptStatus;
    occurredAt: string;
}
export type PaymentEvent = PaymentSucceededEvent | PaymentFailedEvent | PaymentTimedOutEvent;
