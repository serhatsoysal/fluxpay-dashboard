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

export type PricingModel = 'FLAT_RATE' | 'PER_UNIT' | 'TIERED' | 'VOLUME';
export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Price {
    id: string;
    productId: string;
    pricingModel: PricingModel;
    billingInterval: BillingInterval;
    unitAmount: number;
    currency: string;
    trialPeriodDays?: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePriceInput {
    pricingModel: PricingModel;
    billingInterval: BillingInterval;
    unitAmount: number;
    currency: string;
    trialPeriodDays?: number;
}

export interface UpdatePriceInput {
    pricingModel?: PricingModel;
    billingInterval?: BillingInterval;
    unitAmount?: number;
    currency?: string;
    trialPeriodDays?: number;
    active?: boolean;
}