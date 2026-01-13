import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationsApi } from './notificationsApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('notificationsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get with cleaned params', async () => {
            const filters = {
                page: 0,
                size: 20,
                read: false,
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

            const result = await notificationsApi.getAll(filters);

            expect(apiClient.get).toHaveBeenCalledWith('/notifications', {
                params: { page: 0, size: 20, read: false },
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should return empty result on error status 403, 404, or 500', async () => {
            const filters = { page: 0, size: 20 };
            const error = { response: { status: 403 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await notificationsApi.getAll(filters);

            expect(result.content).toEqual([]);
        });

        it('should use empty object as default filters', async () => {
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

            await notificationsApi.getAll();

            expect(apiClient.get).toHaveBeenCalledWith('/notifications', {
                params: {},
            });
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with notification ID', async () => {
            const notificationId = 'notif-123';
            const mockNotification = { id: notificationId, message: 'Test' };
            const mockResponse = { data: mockNotification };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await notificationsApi.getById(notificationId);

            expect(apiClient.get).toHaveBeenCalledWith('/notifications/notif-123');
            expect(result).toEqual(mockNotification);
        });
    });

    describe('getUnreadCount', () => {
        it('should return count from response', async () => {
            const mockResponse = { data: { count: 5 } };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await notificationsApi.getUnreadCount();

            expect(apiClient.get).toHaveBeenCalledWith('/notifications/unread-count');
            expect(result).toBe(5);
        });

        it('should return 0 if count is missing', async () => {
            const mockResponse = { data: {} };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await notificationsApi.getUnreadCount();

            expect(result).toBe(0);
        });

        it('should return 0 on error status 403, 404, or 500', async () => {
            const error = { response: { status: 403 } };

            vi.mocked(apiClient.get).mockRejectedValue(error);

            const result = await notificationsApi.getUnreadCount();

            expect(result).toBe(0);
        });
    });

    describe('markAsRead', () => {
        it('should mark all as read when input.all is true', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            await notificationsApi.markAsRead({ all: true });

            expect(apiClient.post).toHaveBeenCalledWith('/notifications/read-all');
        });

        it('should mark single notification as read when input.id is provided', async () => {
            const notificationId = 'notif-123';
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            await notificationsApi.markAsRead({ id: notificationId });

            expect(apiClient.post).toHaveBeenCalledWith('/notifications/notif-123/read');
        });

        it('should not call API when neither all nor id is provided', async () => {
            await notificationsApi.markAsRead({});

            expect(apiClient.post).not.toHaveBeenCalled();
        });
    });
});

