"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatus = exports.NotificationChannel = exports.NotificationType = void 0;
exports.NotificationType = {
    ORDER_PLACED: "ORDER_PLACED",
    PAYMENT_SUCCEEDED: "PAYMENT_SUCCEEDED",
    PAYMENT_FAILED: "PAYMENT_FAILED",
    ORDER_SHIPPED: "ORDER_SHIPPED",
    ORDER_DELIVERED: "ORDER_DELIVERED"
};
exports.NotificationChannel = {
    EMAIL: "EMAIL",
    SMS: "SMS"
};
exports.NotificationStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SENT: "SENT",
    FAILED: "FAILED"
};
