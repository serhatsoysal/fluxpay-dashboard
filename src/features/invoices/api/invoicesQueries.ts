import { Invoice, InvoiceStats, InvoiceFilters } from '../types/invoice.types';

const MOCK_INVOICES: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        amount: 2400.00,
        currency: 'USD',
        status: 'paid',
        customerName: 'Acme Corp',
        customerEmail: 'acme@corp.com',
        customerInitials: 'A',
        createdDate: '2024-10-10',
        dueDate: '2024-10-24'
    },
    {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        amount: 850.00,
        currency: 'USD',
        status: 'open',
        customerName: 'Jane Startup',
        customerEmail: 'jane@startup.io',
        customerInitials: 'J',
        createdDate: '2024-10-20',
        dueDate: 'Due in 3 days' // simplified for mock
    },
    {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        amount: 150.00,
        currency: 'USD',
        status: 'draft',
        customerName: 'Unknown',
        customerEmail: '--',
        customerInitials: '',
        createdDate: '2024-10-21',
        dueDate: '--'
    },
    {
        id: '4',
        invoiceNumber: 'INV-2023-892',
        amount: 1200.00,
        currency: 'USD',
        status: 'past_due',
        customerName: 'Logistics Global',
        customerEmail: 'logistics@global.com',
        customerInitials: 'L',
        createdDate: '2024-09-15',
        dueDate: '2024-10-01'
    },
    {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        amount: 3150.00,
        currency: 'USD',
        status: 'paid',
        customerName: 'Tech Solutions',
        customerEmail: 'tech@solutions.net',
        customerInitials: 'T',
        createdDate: '2024-10-05',
        dueDate: '2024-10-18'
    },
    {
        id: '6',
        invoiceNumber: 'INV-2024-006',
        amount: 450.00,
        currency: 'USD',
        status: 'void',
        customerName: 'Mary Consulting',
        customerEmail: 'mary@consulting.co',
        customerInitials: 'M',
        createdDate: '2024-10-11',
        dueDate: '2024-10-25'
    }
];

const MOCK_STATS: InvoiceStats = {
    totalOutstanding: 12450.00,
    totalOutstandingChange: 2.5,
    pastDue: 1200.00,
    pastDueChange: 0.8,
    avgPaymentTime: 14,
    avgPaymentTimeChange: -1
};

export const useInvoices = (filters: InvoiceFilters) => {
    const filteredContent = MOCK_INVOICES.filter(inv => {
        if (filters.status && filters.status !== 'uncollectible' && inv.status !== filters.status) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return inv.invoiceNumber.toLowerCase().includes(search) ||
                inv.customerEmail.toLowerCase().includes(search);
        }
        return true;
    });

    return {
        data: {
            content: filteredContent,
            totalElements: filteredContent.length,
            totalPages: 1
        },
        stats: MOCK_STATS,
        isLoading: false,
        error: null
    };
};
