"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEventType = exports.PaymentCommandType = void 0;
exports.PaymentCommandType = {
    PROCESS_PAYMENT: "ProcessPayment"
};
exports.PaymentEventType = {
    PAYMENT_SUCCEEDED: "PaymentSucceeded",
    PAYMENT_FAILED: "PaymentFailed",
    PAYMENT_TIMED_OUT: "PaymentTimedOut"
};
