export interface Payment {
    id: string;
    tenantId: string;
    invoiceId?: string;
    customerId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paymentIntentId?: string;
    transactionId?: string;
    failureReason?: string | null;
    refundedAmount: number;
    metadata?: Record<string, any>;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
    customerName?: string;
    customerEmail?: string;
}

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'CANCELED';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'OTHER';

export interface PaymentFilters {
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    invoiceId?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    page?: number;
    size?: number;
}

export interface PaymentStats {
    totalRevenue: number;
    totalCount: number;
    completedCount: number;
    failedCount: number;
    pendingCount: number;
    refundedAmount: number;
    averagePaymentAmount: number;
    currency: string;
    period?: {
        from: string;
        to: string;
    };
}

export interface CreateRefundInput {
    amount: number;
    reason?: string;
    metadata?: Record<string, any>;
}

export interface Refund {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    reason?: string;
    refundId?: string;
    createdAt: string;
}

