export const OrderStatus = {
  CREATED: "CREATED",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAID: "PAID",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
} as const;

export type OrderStatus =
  (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  currency: string;
  shippingAddressSnapshot: Record<string, unknown>;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
