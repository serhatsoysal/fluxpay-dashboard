export interface Subscription {
    id: string;
    customerId: string;
    customerName: string;
    priceId: string;
    productName: string;
    status: SubscriptionStatus;
    amount: number;
    currency: string;
    interval: BillingInterval;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    quantity: number;
    metadata?: Record<string, string>;
}

export type SubscriptionStatus =
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'paused';

export type BillingInterval = 'day' | 'week' | 'month' | 'year';

export interface SubscriptionFilters {
    status?: SubscriptionStatus;
    customerId?: string;
    page?: number;
    size?: number;
    sort?: string[];
}

export interface CreateSubscriptionInput {
    customerId: string;
    priceId: string;
    quantity: number;
    trialDays?: number;
    metadata?: Record<string, string>;
}
