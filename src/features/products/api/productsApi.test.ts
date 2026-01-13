import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsApi } from './productsApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('productsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call apiClient.get for list', async () => {
            const mockProducts = [{ id: '1', name: 'Product 1' }];
            const mockResponse = { data: mockProducts };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await productsApi.getAll();

            expect(apiClient.get).toHaveBeenCalledWith('/products');
            expect(result).toEqual(mockProducts);
        });
    });

    describe('create', () => {
        it('should call apiClient.post with input', async () => {
            const input = {
                name: 'Product 1',
                description: 'Description',
                active: true,
            };
            const mockProduct = { id: '1', ...input };
            const mockResponse = { data: mockProduct };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await productsApi.create(input);

            expect(apiClient.post).toHaveBeenCalledWith('/products', input);
            expect(result).toEqual(mockProduct);
        });
    });

    describe('getById', () => {
        it('should call apiClient.get with product ID', async () => {
            const productId = 'product-123';
            const mockProduct = { id: productId, name: 'Product 1' };
            const mockResponse = { data: mockProduct };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await productsApi.getById(productId);

            expect(apiClient.get).toHaveBeenCalledWith('/products/product-123');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('update', () => {
        it('should call apiClient.put with ID and input', async () => {
            const productId = 'product-123';
            const input = {
                name: 'Updated Product',
                active: false,
            };
            const mockProduct = { id: productId, ...input };
            const mockResponse = { data: mockProduct };

            vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

            const result = await productsApi.update(productId, input);

            expect(apiClient.put).toHaveBeenCalledWith('/products/product-123', input);
            expect(result).toEqual(mockProduct);
        });
    });

    describe('delete', () => {
        it('should call apiClient.delete with product ID', async () => {
            const productId = 'product-123';
            vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

            await productsApi.delete(productId);

            expect(apiClient.delete).toHaveBeenCalledWith('/products/product-123');
        });
    });

    describe('getPrices', () => {
        it('should call apiClient.get for product prices', async () => {
            const productId = 'product-123';
            const mockPrices = [{ id: 'price-1', amount: 10000 }];
            const mockResponse = { data: mockPrices };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await productsApi.getPrices(productId);

            expect(apiClient.get).toHaveBeenCalledWith('/products/product-123/prices');
            expect(result).toEqual(mockPrices);
        });
    });

    describe('createPrice', () => {
        it('should call apiClient.post to create price', async () => {
            const productId = 'product-123';
            const input = {
                pricingModel: 'FLAT_RATE' as const,
                billingInterval: 'MONTHLY' as const,
                unitAmount: 10000,
                currency: 'USD',
            };
            const mockPrice = { id: 'price-1', productId, ...input };
            const mockResponse = { data: mockPrice };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await productsApi.createPrice(productId, input);

            expect(apiClient.post).toHaveBeenCalledWith('/products/product-123/prices', input);
            expect(result).toEqual(mockPrice);
        });
    });
});

