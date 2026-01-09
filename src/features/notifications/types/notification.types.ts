export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'subscription' | 'invoice' | 'payment';

export type NotificationStatus = 'unread' | 'read';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    createdAt: string;
    readAt?: string;
    metadata?: {
        subscriptionId?: string;
        invoiceId?: string;
        customerId?: string;
        [key: string]: any;
    };
}

export interface NotificationFilters {
    page?: number;
    size?: number;
    status?: NotificationStatus;
    type?: NotificationType;
}

export interface MarkAsReadInput {
    id?: string;
    all?: boolean;
}

