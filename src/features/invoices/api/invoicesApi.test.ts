import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invoicesApi } from './invoicesApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('invoicesApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get with cleaned params', async () => {
            const filters = {
                page: 0,
                size: 20,
                status: 'DRAFT' as const,
            };
            const mockResponse = {
                data: {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                    size: 20,
                    page: 0,
                },
            };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await invoicesApi.getAll(filters);

            expect(apiClient.get).toHaveBeenCalledWith('/invoices', {
                params: { page: 0, size: 20, status: 'DRAFT' },
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should return empty result on error status 403, 404, or 500', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 403 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await invoicesApi.getAll(filters);

            expect(result.content).toEqual([]);
        });
    });

    describe('getStats', () => {
        it('should call apiClient.get for stats', async () => {
            const mockStats = { totalAmount: 100000 };
            const mockResponse = { data: mockStats };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await invoicesApi.getStats();

            expect(apiClient.get).toHaveBeenCalledWith('/invoices/stats');
            expect(result).toEqual(mockStats);
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with invoice ID', async () => {
            const invoiceId = 'invoice-123';
            const mockInvoice = { id: invoiceId, amount: 10000 };
            const mockResponse = { data: mockInvoice };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await invoicesApi.getById(invoiceId);

            expect(apiClient.get).toHaveBeenCalledWith('/invoices/invoice-123');
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('getItems', () => {
        it('should call apiClient.get for invoice items', async () => {
            const invoiceId = 'invoice-123';
            const mockItems = [{ id: 'item-1', description: 'Item 1' }];
            const mockResponse = { data: mockItems };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await invoicesApi.getItems(invoiceId);

            expect(apiClient.get).toHaveBeenCalledWith('/invoices/invoice-123/items');
            expect(result).toEqual(mockItems);
        });
    });

    describe('getByCustomer', () => {
        it('should call apiClient.get with customer ID', async () => {
            const customerId = 'customer-123';
            const mockInvoices = [{ id: 'invoice-1' }];
            const mockResponse = { data: mockInvoices };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await invoicesApi.getByCustomer(customerId);

            expect(apiClient.get).toHaveBeenCalledWith('/invoices/customer/customer-123');
            expect(result).toEqual(mockInvoices);
        });
    });

    describe('finalize', () => {
        it('should call apiClient.post to finalize invoice', async () => {
            const invoiceId = 'invoice-123';
            const mockInvoice = { id: invoiceId, status: 'FINALIZED' };
            const mockResponse = { data: mockInvoice };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await invoicesApi.finalize(invoiceId);

            expect(apiClient.post).toHaveBeenCalledWith('/invoices/invoice-123/finalize');
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('void', () => {
        it('should call apiClient.post to void invoice', async () => {
            const invoiceId = 'invoice-123';
            const mockInvoice = { id: invoiceId, status: 'VOIDED' };
            const mockResponse = { data: mockInvoice };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await invoicesApi.void(invoiceId);

            expect(apiClient.post).toHaveBeenCalledWith('/invoices/invoice-123/void');
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('create', () => {
        it('should call apiClient.post to create invoice', async () => {
            const input = {
                customerId: 'customer-123',
                invoiceDate: '2024-01-01',
                dueDate: '2024-01-31',
                currency: 'USD',
                items: [
                    {
                        description: 'Item 1',
                        quantity: 1,
                        unitAmount: 10000,
                        amount: 10000,
                    },
                ],
            };
            const mockInvoice = { id: 'invoice-123', ...input };
            const mockResponse = { data: mockInvoice };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await invoicesApi.create(input);

            expect(apiClient.post).toHaveBeenCalledWith('/invoices', input);
            expect(result).toEqual(mockInvoice);
        });
    });
});

