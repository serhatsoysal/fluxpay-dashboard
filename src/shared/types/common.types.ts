export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenants: Tenant[];
}

export interface Tenant {
    id: string;
    name: string;
    domain: string;
}

export type UserRole = 'owner' | 'admin' | 'billing_admin' | 'member' | 'read_only';

export type Permission =
    | '*'
    | 'subscriptions.*' | 'subscriptions.read' | 'subscriptions.write'
    | 'customers.*' | 'customers.read' | 'customers.write'
    | 'invoices.*' | 'invoices.read' | 'invoices.write'
    | 'products.*' | 'products.read' | 'products.write'
    | 'payments.*' | 'payments.read' | 'payments.write'
    | '*.read';
