export const NotificationType = {
  ORDER_PLACED: "ORDER_PLACED",
  PAYMENT_SUCCEEDED: "PAYMENT_SUCCEEDED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  ORDER_SHIPPED: "ORDER_SHIPPED",
  ORDER_DELIVERED: "ORDER_DELIVERED"
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationChannel = {
  EMAIL: "EMAIL",
  SMS: "SMS"
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SENT: "SENT",
  FAILED: "FAILED"
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

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
