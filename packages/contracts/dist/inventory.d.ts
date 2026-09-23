export declare const ReservationStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly CONFIRMED: "CONFIRMED";
    readonly RELEASED: "RELEASED";
    readonly EXPIRED: "EXPIRED";
};
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];
export interface Inventory {
    id: string;
    productId: string;
    quantity: number;
    reservedQuantity: number;
    updatedAt: string;
}
export interface InventoryReservation {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    status: ReservationStatus;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}
