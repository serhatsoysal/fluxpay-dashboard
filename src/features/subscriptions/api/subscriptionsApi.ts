import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Subscription, SubscriptionFilters, CreateSubscriptionInput } from '../types/subscription.types';

const cleanParams = (params: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
            if (key === 'status' && typeof value === 'string') {
                cleaned[key] = value.toUpperCase().replace(/ /g, '_');
            } else {
                cleaned[key] = value;
            }
        }
    });
    return cleaned;
};

export const subscriptionsApi = {
    getAll: async (filters: SubscriptionFilters): Promise<PaginatedResponse<Subscription>> => {
        const cleanedParams = cleanParams(filters);
        try {
            const response = await apiClient.get(API_ROUTES.SUBSCRIPTIONS.BASE, { params: cleanedParams });
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

    getById: async (id: string): Promise<Subscription> => {
        const response = await apiClient.get(API_ROUTES.SUBSCRIPTIONS.GET(id));
        return response.data;
    },

    getItems: async (id: string): Promise<any[]> => {
        const response = await apiClient.get(API_ROUTES.SUBSCRIPTIONS.ITEMS(id));
        return response.data;
    },

    create: async (input: CreateSubscriptionInput): Promise<Subscription> => {
        const response = await apiClient.post(API_ROUTES.SUBSCRIPTIONS.CREATE, input);
        return response.data;
    },

    update: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
        const response = await apiClient.put(API_ROUTES.SUBSCRIPTIONS.GET(id), data);
        return response.data;
    },

    cancel: async (id: string, immediately: boolean = false, reason?: string): Promise<Subscription> => {
        const params = new URLSearchParams();
        params.append('immediately', immediately.toString());
        if (reason) {
            params.append('reason', reason);
        }
        const response = await apiClient.post(`${API_ROUTES.SUBSCRIPTIONS.CANCEL(id)}?${params.toString()}`);
        return response.data;
    },

    pause: async (id: string): Promise<Subscription> => {
        const response = await apiClient.post(API_ROUTES.SUBSCRIPTIONS.PAUSE(id));
        return response.data;
    },

    resume: async (id: string): Promise<Subscription> => {
        const response = await apiClient.post(API_ROUTES.SUBSCRIPTIONS.RESUME(id));
        return response.data;
    },
};
