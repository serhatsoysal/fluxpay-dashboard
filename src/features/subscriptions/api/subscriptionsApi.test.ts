import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscriptionsApi } from './subscriptionsApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

describe('subscriptionsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get with cleaned params', async () => {
            const filters = {
                page: 0,
                size: 20,
                status: 'active' as const,
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

            const result = await subscriptionsApi.getAll(filters);

            expect(apiClient.get).toHaveBeenCalledWith('/subscriptions', {
                params: { page: 0, size: 20, status: 'ACTIVE' },
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should return empty result on error status 403, 404, or 500', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 403 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await subscriptionsApi.getAll(filters);

            expect(result.content).toEqual([]);
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with subscription ID', async () => {
            const subscriptionId = 'sub-123';
            const mockSubscription = { id: subscriptionId };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.getById(subscriptionId);

            expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/sub-123');
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('getItems', () => {
        it('should call apiClient.get for subscription items', async () => {
            const subscriptionId = 'sub-123';
            const mockItems = [{ id: 'item-1' }];
            const mockResponse = { data: mockItems };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.getItems(subscriptionId);

            expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/sub-123/items');
            expect(result).toEqual(mockItems);
        });
    });

    describe('create', () => {
        it('should call apiClient.post with input', async () => {
            const input = {
                customerId: 'customer-123',
                priceId: 'price-123',
                quantity: 1,
            };
            const mockSubscription = { id: 'sub-1', ...input };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.create(input);

            expect(apiClient.post).toHaveBeenCalledWith('/subscriptions', input);
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('update', () => {
        it('should call apiClient.put with ID and data', async () => {
            const subscriptionId = 'sub-123';
            const data = { quantity: 2 };
            const mockSubscription = { id: subscriptionId, ...data };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.update(subscriptionId, data);

            expect(apiClient.put).toHaveBeenCalledWith('/subscriptions/sub-123', data);
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('cancel', () => {
        it('should call apiClient.post with cancel endpoint and params', async () => {
            const subscriptionId = 'sub-123';
            const mockSubscription = { id: subscriptionId, status: 'CANCELED' };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.cancel(subscriptionId, false, 'Reason');

            expect(apiClient.post).toHaveBeenCalledWith(
                expect.stringContaining('/subscriptions/sub-123/cancel')
            );
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('pause', () => {
        it('should call apiClient.post to pause subscription', async () => {
            const subscriptionId = 'sub-123';
            const mockSubscription = { id: subscriptionId, status: 'PAUSED' };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.pause(subscriptionId);

            expect(apiClient.post).toHaveBeenCalledWith('/subscriptions/sub-123/pause');
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('resume', () => {
        it('should call apiClient.post to resume subscription', async () => {
            const subscriptionId = 'sub-123';
            const mockSubscription = { id: subscriptionId, status: 'ACTIVE' };
            const mockResponse = { data: mockSubscription };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await subscriptionsApi.resume(subscriptionId);

            expect(apiClient.post).toHaveBeenCalledWith('/subscriptions/sub-123/resume');
            expect(result).toEqual(mockSubscription);
        });
    });
});

