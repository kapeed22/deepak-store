export const ReservationStatus = {
  ACTIVE: "ACTIVE",
  CONFIRMED: "CONFIRMED",
  RELEASED: "RELEASED",
  EXPIRED: "EXPIRED"
} as const;

export type ReservationStatus =
  (typeof ReservationStatus)[keyof typeof ReservationStatus];

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
