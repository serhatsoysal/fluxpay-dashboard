export interface Invoice {
    id: string;
    tenantId: string;
    customerId: string;
    subscriptionId?: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    subtotal: number;
    tax: number;
    total: number;
    amountDue: number;
    amountPaid: number;
    currency: string;
    invoiceDate: string;
    dueDate: string;
    paidAt: string | null;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
    updatedAt: string;
    customerName?: string;
    customerEmail?: string;
    customerInitials?: string;
}

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    description: string;
    quantity: number;
    unitAmount: number;
    amount: number;
    isProration: boolean;
    createdAt?: string;
}

export type InvoiceStatus = 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE';

export interface InvoiceFilters {
    status?: InvoiceStatus;
    search?: string;
    page?: number;
    size?: number;
}

export interface InvoiceStats {
    totalCount: number;
    totalAmount: number;
    totalAmountDue: number;
    totalAmountPaid: number;
    countByStatus: {
        DRAFT: number;
        OPEN: number;
        PAID: number;
        VOID: number;
        UNCOLLECTIBLE: number;
    };
    overdueCount: number;
    overdueAmount: number;
}
