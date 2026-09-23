export declare const NotificationType: {
    readonly ORDER_PLACED: "ORDER_PLACED";
    readonly PAYMENT_SUCCEEDED: "PAYMENT_SUCCEEDED";
    readonly PAYMENT_FAILED: "PAYMENT_FAILED";
    readonly ORDER_SHIPPED: "ORDER_SHIPPED";
    readonly ORDER_DELIVERED: "ORDER_DELIVERED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const NotificationChannel: {
    readonly EMAIL: "EMAIL";
    readonly SMS: "SMS";
};
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export declare const NotificationStatus: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
export interface Notification {
    id: string;
    userId: string;
    orderId?: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    recipient: string;
    attemptCount: number;
    lastError?: string;
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
}
