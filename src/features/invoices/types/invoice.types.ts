export interface Invoice {
    id: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    customerName: string;
    customerEmail: string;
    customerInitials: string;
    dueDate?: string;
    createdDate: string;
}

export type InvoiceStatus = 'paid' | 'open' | 'draft' | 'past_due' | 'void' | 'uncollectible';

export interface InvoiceFilters {
    status?: InvoiceStatus;
    search?: string;
    page?: number;
    size?: number;
}

export interface InvoiceStats {
    totalOutstanding: number;
    totalOutstandingChange: number;
    pastDue: number;
    pastDueChange: number;
    avgPaymentTime: number; // in days
    avgPaymentTimeChange: number;
}
