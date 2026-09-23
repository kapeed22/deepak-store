export declare const OrderStatus: {
    readonly CREATED: "CREATED";
    readonly PAYMENT_PENDING: "PAYMENT_PENDING";
    readonly PAID: "PAID";
    readonly PAYMENT_FAILED: "PAYMENT_FAILED";
    readonly CONFIRMED: "CONFIRMED";
    readonly PROCESSING: "PROCESSING";
    readonly READY_FOR_PICKUP: "READY_FOR_PICKUP";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
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
