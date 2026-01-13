import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webhooksApi } from './webhooksApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('webhooksApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get for list', async () => {
            const mockWebhooks = [{ id: '1', url: 'https://example.com' }];
            const mockResponse = { data: mockWebhooks };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await webhooksApi.getAll();

            expect(apiClient.get).toHaveBeenCalledWith('/webhooks');
            expect(result).toEqual(mockWebhooks);
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with webhook ID', async () => {
            const webhookId = 'webhook-123';
            const mockWebhook = { id: webhookId, url: 'https://example.com' };
            const mockResponse = { data: mockWebhook };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await webhooksApi.getById(webhookId);

            expect(apiClient.get).toHaveBeenCalledWith('/webhooks/webhook-123');
            expect(result).toEqual(mockWebhook);
        });
    });

    describe('create', () => {
        it('should call apiClient.post with input', async () => {
            const input = {
                url: 'https://example.com/webhook',
                events: ['payment.completed'],
                active: true,
                secret: 'secret-key',
            };
            const mockWebhook = { id: '1', ...input };
            const mockResponse = { data: mockWebhook };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await webhooksApi.create(input);

            expect(apiClient.post).toHaveBeenCalledWith('/webhooks', input);
            expect(result).toEqual(mockWebhook);
        });
    });

    describe('update', () => {
        it('should call apiClient.put with ID and input', async () => {
            const webhookId = 'webhook-123';
            const input = {
                url: 'https://example.com/webhook',
                events: ['payment.completed'],
            };
            const mockWebhook = { id: webhookId, ...input };
            const mockResponse = { data: mockWebhook };

            vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

            const result = await webhooksApi.update(webhookId, input);

            expect(apiClient.put).toHaveBeenCalledWith('/webhooks/webhook-123', input);
            expect(result).toEqual(mockWebhook);
        });
    });

    describe('delete', () => {
        it('should call apiClient.delete with webhook ID', async () => {
            const webhookId = 'webhook-123';
            vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

            await webhooksApi.delete(webhookId);

            expect(apiClient.delete).toHaveBeenCalledWith('/webhooks/webhook-123');
        });
    });
});

