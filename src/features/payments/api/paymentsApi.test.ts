import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentsApi } from './paymentsApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('paymentsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get with cleaned params', async () => {
            const filters = {
                page: 0,
                size: 20,
                status: 'COMPLETED' as const,
                paymentMethod: 'CREDIT_CARD' as const,
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

            const result = await paymentsApi.getAll(filters);

            expect(apiClient.get).toHaveBeenCalledWith('/payments', {
                params: {
                    page: 0,
                    size: 20,
                    status: 'COMPLETED',
                    paymentMethod: 'CREDIT_CARD',
                },
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should return empty result on 403 error', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 403 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await paymentsApi.getAll(filters);

            expect(result).toEqual({
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: 20,
                page: 0,
            });
        });

        it('should return empty result on 404 error', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 404 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await paymentsApi.getAll(filters);

            expect(result.content).toEqual([]);
        });

        it('should return empty result on 500 error', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 500 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await paymentsApi.getAll(filters);

            expect(result.content).toEqual([]);
        });

        it('should throw error for other status codes', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 400 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            await expect(paymentsApi.getAll(filters)).rejects.toEqual(error);
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with payment ID', async () => {
            const paymentId = 'payment-123';
            const mockPayment = {
                id: paymentId,
                amount: 10000,
                currency: 'USD',
                status: 'COMPLETED',
            };
            const mockResponse = { data: mockPayment };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await paymentsApi.getById(paymentId);

            expect(apiClient.get).toHaveBeenCalledWith('/payments/payment-123');
            expect(result).toEqual(mockPayment);
        });
    });

    describe('getStats', () => {
        it('should call apiClient.get with filters', async () => {
            const filters = { dateFrom: '2024-01-01', dateTo: '2024-01-31' };
            const mockStats = {
                totalRevenue: 100000,
                completedCount: 10,
                failedCount: 2,
            };
            const mockResponse = { data: mockStats };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await paymentsApi.getStats(filters);

            expect(apiClient.get).toHaveBeenCalledWith('/payments/stats', {
                params: filters,
            });
            expect(result).toEqual(mockStats);
        });

        it('should call apiClient.get without filters', async () => {
            const mockStats = { totalRevenue: 0 };
            const mockResponse = { data: mockStats };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await paymentsApi.getStats();

            expect(apiClient.get).toHaveBeenCalledWith('/payments/stats', {
                params: {},
            });
            expect(result).toEqual(mockStats);
        });
    });

    describe('createRefund', () => {
        it('should call apiClient.post with payment ID and refund input', async () => {
            const paymentId = 'payment-123';
            const input = { amount: 5000, reason: 'Customer request' };
            const mockRefund = {
                id: 'refund-123',
                paymentId,
                amount: 5000,
                currency: 'USD',
                reason: 'Customer request',
                status: 'PENDING',
                createdAt: '2024-01-01T00:00:00Z',
            };
            const mockResponse = { data: mockRefund };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await paymentsApi.createRefund(paymentId, input);

            expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-123/refund', input);
            expect(result).toEqual(mockRefund);
        });
    });
});

