import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { Product } from '../types/product.types';

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

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'FluxPay Enterprise Platform',
        productId: 'prod_HKj23m9x',
        icon: 'cloud_queue',
        status: 'active',
        createdDate: 'Oct 24, 2023',
        createdTime: '10:42 AM',
        plans: [
            { name: 'Enterprise Tier', price: '$499.00 / mo' },
            { name: 'Professional Tier', price: '$99.00 / mo' },
            { name: 'Starter Tier', price: '$29.00 / mo' }
        ]
    },
    {
        id: '2',
        name: 'API Usage Add-on',
        productId: 'prod_88sfdK2L',
        icon: 'api',
        status: 'active',
        createdDate: 'Sep 12, 2023',
        createdTime: '03:15 PM',
        plans: [
            { name: 'Metered Usage', price: '$0.05 / unit' }
        ]
    },
    {
        id: '3',
        name: 'Premium Support Pack',
        productId: 'prod_Sup2023X',
        icon: 'support_agent',
        status: 'paused',
        createdDate: 'Aug 05, 2023',
        createdTime: '09:30 AM',
        plans: [
            { name: 'Standard License', price: '$150.00 / mo' }
        ]
    },
    {
        id: '4',
        name: 'Legacy Analytics v1',
        productId: 'prod_nn213X8Z',
        icon: 'archive',
        status: 'archived',
        createdDate: 'Jan 15, 2022',
        createdTime: '11:00 AM',
        plans: [
            { name: 'Basic Plan', price: '$10.00 / mo', isStrikethrough: true }
        ]
    }
];

let productsList: Product[] = [...MOCK_PRODUCTS];

export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await apiClient.get(API_ROUTES.PRODUCTS.LIST);
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const apiProducts = response.data;
                apiProducts.forEach((apiProduct: Product) => {
                    const existingIndex = productsList.findIndex(p => p.id === apiProduct.id);
                    if (existingIndex === -1) {
                        productsList.push(apiProduct);
                    }
                });
            }
            return [...productsList];
        } catch (error: any) {
            return [...productsList];
        }
    },

    create: async (input: CreateProductInput): Promise<Product> => {
        try {
            const response = await apiClient.post(API_ROUTES.PRODUCTS.CREATE, input);
            const newProduct = response.data;
            
            const iconMap: Record<string, string> = {
                'subscription': 'cloud_queue',
                'one-time': 'shopping_cart',
                'usage-based': 'api',
                'addon': 'add_box',
            };
            
            const category = input.metadata?.category || 'subscription';
            const icon = iconMap[category] || 'inventory_2';
            
            const productId = `prod_${Math.random().toString(36).substring(2, 11)}`;
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            const product: Product = {
                id: newProduct.id || Math.random().toString(36).substring(2, 9),
                name: newProduct.name || input.name,
                description: newProduct.description || input.description,
                productId: productId,
                icon: icon,
                status: input.active ? 'active' : 'paused',
                createdDate: formattedDate,
                createdTime: formattedTime,
                plans: [],
                metadata: {
                    featured: input.metadata?.featured || false,
                    category: input.metadata?.category || category,
                },
            };
            
            productsList = [product, ...productsList];
            return product;
        } catch (error: any) {
            throw error;
        }
    },

    getById: async (id: string): Promise<Product> => {
        try {
            const response = await apiClient.get(API_ROUTES.PRODUCTS.GET(id));
            return response.data;
        } catch (error: any) {
            const product = productsList.find(p => p.id === id);
            if (product) return product;
            throw error;
        }
    },

    update: async (id: string, input: UpdateProductInput): Promise<Product> => {
        let index = productsList.findIndex(p => p.id === id);
        
        if (index === -1) {
            const iconMap: Record<string, string> = {
                'subscription': 'cloud_queue',
                'one-time': 'shopping_cart',
                'usage-based': 'api',
                'addon': 'add_box',
            };
            
            const category = input.metadata?.category || 'subscription';
            const icon = iconMap[category] || 'inventory_2';
            
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            const newProduct: Product = {
                id: id,
                name: input.name,
                description: input.description,
                productId: `prod_${Math.random().toString(36).substring(2, 11)}`,
                icon: icon,
                status: input.active ? 'active' : 'paused',
                createdDate: formattedDate,
                createdTime: formattedTime,
                plans: [],
                metadata: {
                    featured: input.metadata?.featured || false,
                    category: category,
                },
            };
            
            productsList = [newProduct, ...productsList];
            return newProduct;
        }

        const iconMap: Record<string, string> = {
            'subscription': 'cloud_queue',
            'one-time': 'shopping_cart',
            'usage-based': 'api',
            'addon': 'add_box',
        };
        
        const icon = input.metadata?.category 
            ? (iconMap[input.metadata.category] || productsList[index].icon) 
            : productsList[index].icon;
        
        const existingProduct = productsList[index];
        const updatedProductData: Product = {
            ...existingProduct,
            name: input.name,
            description: input.description || existingProduct.description,
            status: input.active ? 'active' : 'paused',
            icon: icon,
            metadata: {
                featured: input.metadata?.featured ?? existingProduct.metadata?.featured ?? false,
                category: input.metadata?.category || existingProduct.metadata?.category,
            },
        };

        try {
            const response = await apiClient.put(API_ROUTES.PRODUCTS.UPDATE(id), input).catch(() => null);
            if (response?.data) {
                const updatedProduct = response.data;
                productsList[index] = {
                    ...updatedProductData,
                    name: updatedProduct.name || input.name,
                    description: updatedProduct.description || input.description || existingProduct.description,
                    metadata: {
                        featured: input.metadata?.featured ?? updatedProductData.metadata?.featured ?? false,
                        category: input.metadata?.category || updatedProductData.metadata?.category,
                    },
                };
                return productsList[index];
            }
        } catch {
        }
        productsList[index] = updatedProductData;
        return productsList[index];
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(API_ROUTES.PRODUCTS.DELETE(id));
            productsList = productsList.filter(p => p.id !== id);
        } catch (error: any) {
            productsList = productsList.filter(p => p.id !== id);
            throw error;
        }
    },
};

