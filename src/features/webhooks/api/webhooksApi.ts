import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { Webhook, CreateWebhookInput, UpdateWebhookInput } from '../types/webhook.types';

export const webhooksApi = {
    getAll: async (): Promise<Webhook[]> => {
        const response = await apiClient.get(API_ROUTES.WEBHOOKS.LIST);
        return response.data;
    },

    getById: async (id: string): Promise<Webhook> => {
        const response = await apiClient.get(API_ROUTES.WEBHOOKS.GET(id));
        return response.data;
    },

    create: async (input: CreateWebhookInput): Promise<Webhook> => {
        const response = await apiClient.post(API_ROUTES.WEBHOOKS.CREATE, input);
        return response.data;
    },

    update: async (id: string, input: UpdateWebhookInput): Promise<Webhook> => {
        const response = await apiClient.put(API_ROUTES.WEBHOOKS.UPDATE(id), input);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_ROUTES.WEBHOOKS.DELETE(id));
    },
};

