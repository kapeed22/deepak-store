export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  TIMED_OUT: "TIMED_OUT"
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentAttemptStatus = {
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  TIMED_OUT: "TIMED_OUT"
} as const;

export type PaymentAttemptStatus =
  (typeof PaymentAttemptStatus)[keyof typeof PaymentAttemptStatus];

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  provider: string;
  amount: number;
  currency: string;
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAttempt {
  id: string;
  paymentId: string;
  attemptNumber: number;
  status: PaymentAttemptStatus;
  providerReference?: string;
  errorCode?: string;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}
