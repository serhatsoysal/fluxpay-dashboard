import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { Invoice, InvoiceItem, InvoiceFilters, InvoiceStats } from '../types/invoice.types';
import { PaginatedResponse } from '@/shared/types/api.types';

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

export const invoicesApi = {
    getAll: async (filters: InvoiceFilters): Promise<PaginatedResponse<Invoice>> => {
        const cleanedParams = cleanParams(filters);
        try {
            const response = await apiClient.get(API_ROUTES.INVOICES.LIST, { params: cleanedParams });
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

    getStats: async (): Promise<InvoiceStats> => {
        const response = await apiClient.get(API_ROUTES.INVOICES.STATS);
        return response.data;
    },

    getById: async (id: string): Promise<Invoice> => {
        const response = await apiClient.get(API_ROUTES.INVOICES.GET(id));
        return response.data;
    },

    getItems: async (id: string): Promise<InvoiceItem[]> => {
        const response = await apiClient.get(API_ROUTES.INVOICES.ITEMS(id));
        return response.data;
    },

    getByCustomer: async (customerId: string): Promise<Invoice[]> => {
        const response = await apiClient.get(API_ROUTES.INVOICES.CUSTOMER(customerId));
        return response.data;
    },

    finalize: async (id: string): Promise<Invoice> => {
        const response = await apiClient.post(API_ROUTES.INVOICES.FINALIZE(id));
        return response.data;
    },

    void: async (id: string): Promise<Invoice> => {
        const response = await apiClient.post(API_ROUTES.INVOICES.VOID(id));
        return response.data;
    },
};

