import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Notification, NotificationFilters, MarkAsReadInput } from '../types/notification.types';

const cleanParams = (params: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key] = value;
        }
    });
    return cleaned;
};

export const notificationsApi = {
    getAll: async (filters: NotificationFilters = {}): Promise<PaginatedResponse<Notification>> => {
        const cleanedParams = cleanParams(filters);
        try {
            const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.LIST, { params: cleanedParams });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403 || error.response?.status === 404 || error.response?.status === 500) {
                return {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                    size: cleanedParams.size || 20,
                    page: cleanedParams.page || 0,
                };
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Notification> => {
        const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.GET(id));
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        try {
            const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.COUNT);
            return response.data.count || 0;
        } catch (error: any) {
            if (error.response?.status === 403 || error.response?.status === 404 || error.response?.status === 500) {
                return 0;
            }
            throw error;
        }
    },

    markAsRead: async (input: MarkAsReadInput): Promise<void> => {
        if (input.all) {
            await apiClient.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ);
        } else if (input.id) {
            await apiClient.post(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(input.id));
        }
    },
};

