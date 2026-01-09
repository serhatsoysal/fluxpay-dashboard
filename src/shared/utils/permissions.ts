import { User, UserRole, Permission } from '@/shared/types/common.types';

const rolePermissions: Record<UserRole, Permission[]> = {
    owner: ['*'],
    admin: ['subscriptions.*', 'customers.*', 'invoices.*', 'products.read'],
    billing_admin: ['invoices.*', 'payments.*', 'subscriptions.read'],
    member: ['subscriptions.read', 'customers.read'],
    read_only: ['*.read'],
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
    if (!user) return false;

    const userPerms = rolePermissions[user.role];
    return (
        userPerms.includes('*') ||
        userPerms.includes(permission) ||
        userPerms.some((p) => p.endsWith('.*') && permission.startsWith(p.slice(0, -1)))
    );
};
