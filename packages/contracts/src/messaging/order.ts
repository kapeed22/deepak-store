export const OrderEventType = {
  ORDER_PLACED: "OrderPlaced",
  ORDER_CONFIRMED: "OrderConfirmed",
  ORDER_SHIPPED: "OrderShipped",
  ORDER_DELIVERED: "OrderDelivered",
  ORDER_CANCELLED: "OrderCancelled"
} as const;

export type OrderEventType =
  (typeof OrderEventType)[keyof typeof OrderEventType];

export interface OrderPlacedEvent {
  type: typeof OrderEventType.ORDER_PLACED;

  eventId: string;

  orderId: string;
  userId: string;

  total: number;
  currency: string;

  occurredAt: string;
}

export interface OrderConfirmedEvent {
  type: typeof OrderEventType.ORDER_CONFIRMED;

  eventId: string;

  orderId: string;
  userId: string;

  occurredAt: string;
}

export interface OrderShippedEvent {
  type: typeof OrderEventType.ORDER_SHIPPED;

  eventId: string;

  orderId: string;
  userId: string;

  occurredAt: string;
}

export interface OrderDeliveredEvent {
  type: typeof OrderEventType.ORDER_DELIVERED;

  eventId: string;

  orderId: string;
  userId: string;

  occurredAt: string;
}

export interface OrderCancelledEvent {
  type: typeof OrderEventType.ORDER_CANCELLED;

  eventId: string;

  orderId: string;
  userId: string;

  reason: string;

  occurredAt: string;
}

export type OrderEvent =
  | OrderPlacedEvent
  | OrderConfirmedEvent
  | OrderShippedEvent
  | OrderDeliveredEvent
  | OrderCancelledEvent;
