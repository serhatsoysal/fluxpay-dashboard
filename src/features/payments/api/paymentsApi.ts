import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { Payment, PaymentFilters, PaymentStats, CreateRefundInput, Refund } from '../types/payment.types';
import { PaginatedResponse } from '@/shared/types/api.types';

const cleanParams = (params: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
            if (key === 'status' && typeof value === 'string') {
                cleaned[key] = value.toUpperCase().replaceAll(' ', '_');
            } else if (key === 'paymentMethod' && typeof value === 'string') {
                cleaned[key] = value.toUpperCase().replaceAll(' ', '_');
            } else {
                cleaned[key] = value;
            }
        }
    });
    return cleaned;
};

export const paymentsApi = {
    getAll: async (filters: PaymentFilters): Promise<PaginatedResponse<Payment>> => {
        const cleanedParams = cleanParams(filters);
        try {
            const response = await apiClient.get(API_ROUTES.PAYMENTS.LIST, { params: cleanedParams });
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

    getById: async (id: string): Promise<Payment> => {
        const response = await apiClient.get(API_ROUTES.PAYMENTS.GET(id));
        return response.data;
    },

    getStats: async (filters?: { dateFrom?: string; dateTo?: string }): Promise<PaymentStats> => {
        const params = filters ? cleanParams(filters) : {};
        const response = await apiClient.get(API_ROUTES.PAYMENTS.STATS, { params });
        return response.data;
    },

    createRefund: async (id: string, input: CreateRefundInput): Promise<Refund> => {
        const response = await apiClient.post(API_ROUTES.PAYMENTS.REFUND(id), input);
        return response.data;
    },
};

