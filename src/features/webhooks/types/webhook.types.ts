export interface Webhook {
    id: string;
    tenantId?: string;
    url: string;
    events: string[];
    active: boolean;
    secret?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWebhookInput {
    url: string;
    events: string[];
    active: boolean;
    secret?: string;
}

export interface UpdateWebhookInput {
    url?: string;
    events?: string[];
    active?: boolean;
    secret?: string;
}

