export interface Product {
    id: string;
    name: string;
    description?: string;
    productId: string;
    icon: string;
    plans: ProductPlan[];
    createdDate: string;
    createdTime: string;
    status: ProductStatus;
    metadata?: {
        featured?: boolean;
        category?: string;
    };
}

export interface ProductPlan {
    name: string;
    price: string;
    isStrikethrough?: boolean;
}

export type ProductStatus = 'active' | 'archived' | 'paused';

export interface ProductFilters {
    search?: string;
    status?: string;
    type?: string;
    created?: string;
}
