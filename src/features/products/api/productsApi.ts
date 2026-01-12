import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { Product, Price, CreatePriceInput } from '../types/product.types';

export interface CreateProductInput {
    name: string;
    description?: string;
    active: boolean;
    metadata?: {
        featured?: boolean;
        category?: string;
    };
}

export interface UpdateProductInput {
    name: string;
    description?: string;
    active: boolean;
    metadata?: {
        featured?: boolean;
        category?: string;
    };
}

export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await apiClient.get(API_ROUTES.PRODUCTS.LIST);
        return response.data;
    },

    create: async (input: CreateProductInput): Promise<Product> => {
        const response = await apiClient.post(API_ROUTES.PRODUCTS.CREATE, input);
        return response.data;
    },

    getById: async (id: string): Promise<Product> => {
        const response = await apiClient.get(API_ROUTES.PRODUCTS.GET(id));
        return response.data;
    },

    update: async (id: string, input: UpdateProductInput): Promise<Product> => {
        const response = await apiClient.put(API_ROUTES.PRODUCTS.UPDATE(id), input);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(API_ROUTES.PRODUCTS.DELETE(id));
    },

    getPrices: async (productId: string): Promise<Price[]> => {
        const response = await apiClient.get(API_ROUTES.PRODUCTS.LIST_PRICES(productId));
        return response.data;
    },

    createPrice: async (productId: string, input: CreatePriceInput): Promise<Price> => {
        const response = await apiClient.post(API_ROUTES.PRODUCTS.CREATE_PRICE(productId), input);
        return response.data;
    },
};

