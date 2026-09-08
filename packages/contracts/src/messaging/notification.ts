import {
  NotificationChannel,
  NotificationType
} from "../notification";

export const NotificationCommandType = {
  SEND_NOTIFICATION: "SendNotification"
} as const;

export type NotificationCommandType =
  (typeof NotificationCommandType)[keyof typeof NotificationCommandType];

export interface SendNotificationCommand {
  type: typeof NotificationCommandType.SEND_NOTIFICATION;

  messageId: string;

  notificationId: string;

  userId: string;
  orderId?: string;

  notificationType: NotificationType;
  channel: NotificationChannel;

  recipient: string;

  createdAt: string;
}
