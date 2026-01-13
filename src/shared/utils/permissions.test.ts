import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';
import { User, UserRole } from '@/shared/types/common.types';

describe('hasPermission', () => {
    it('should return false for null user', () => {
        expect(hasPermission(null, 'subscriptions.read')).toBe(false);
    });

    describe('owner role', () => {
        const owner: User = {
            id: '1',
            email: 'owner@test.com',
            name: 'Owner',
            role: 'owner' as UserRole,
            tenants: [],
        };

        it('should return true for any permission', () => {
            expect(hasPermission(owner, 'subscriptions.read')).toBe(true);
            expect(hasPermission(owner, 'subscriptions.write')).toBe(true);
            expect(hasPermission(owner, 'customers.*')).toBe(true);
        });
    });

    describe('admin role', () => {
        const admin: User = {
            id: '2',
            email: 'admin@test.com',
            name: 'Admin',
            role: 'admin' as UserRole,
            tenants: [],
        };

        it('should return true for subscriptions permissions', () => {
            expect(hasPermission(admin, 'subscriptions.read')).toBe(true);
            expect(hasPermission(admin, 'subscriptions.write')).toBe(true);
        });

        it('should return true for customers permissions', () => {
            expect(hasPermission(admin, 'customers.read')).toBe(true);
            expect(hasPermission(admin, 'customers.write')).toBe(true);
        });

        it('should return true for invoices permissions', () => {
            expect(hasPermission(admin, 'invoices.read')).toBe(true);
            expect(hasPermission(admin, 'invoices.write')).toBe(true);
        });

        it('should return true for products.read', () => {
            expect(hasPermission(admin, 'products.read')).toBe(true);
        });

        it('should return false for products.write', () => {
            expect(hasPermission(admin, 'products.write')).toBe(false);
        });
    });

    describe('billing_admin role', () => {
        const billingAdmin: User = {
            id: '3',
            email: 'billing@test.com',
            name: 'Billing Admin',
            role: 'billing_admin' as UserRole,
            tenants: [],
        };

        it('should return true for invoices permissions', () => {
            expect(hasPermission(billingAdmin, 'invoices.read')).toBe(true);
            expect(hasPermission(billingAdmin, 'invoices.write')).toBe(true);
        });

        it('should return true for payments permissions', () => {
            expect(hasPermission(billingAdmin, 'payments.read')).toBe(true);
            expect(hasPermission(billingAdmin, 'payments.write')).toBe(true);
        });

        it('should return true for subscriptions.read', () => {
            expect(hasPermission(billingAdmin, 'subscriptions.read')).toBe(true);
        });

        it('should return false for subscriptions.write', () => {
            expect(hasPermission(billingAdmin, 'subscriptions.write')).toBe(false);
        });
    });

    describe('member role', () => {
        const member: User = {
            id: '4',
            email: 'member@test.com',
            name: 'Member',
            role: 'member' as UserRole,
            tenants: [],
        };

        it('should return true for subscriptions.read', () => {
            expect(hasPermission(member, 'subscriptions.read')).toBe(true);
        });

        it('should return true for customers.read', () => {
            expect(hasPermission(member, 'customers.read')).toBe(true);
        });

        it('should return false for write permissions', () => {
            expect(hasPermission(member, 'subscriptions.write')).toBe(false);
            expect(hasPermission(member, 'customers.write')).toBe(false);
        });
    });

    describe('read_only role', () => {
        const readOnly: User = {
            id: '5',
            email: 'readonly@test.com',
            name: 'Read Only',
            role: 'read_only' as UserRole,
            tenants: [],
        };

        it('should return true for any read permission', () => {
            expect(hasPermission(readOnly, 'subscriptions.read')).toBe(true);
            expect(hasPermission(readOnly, 'customers.read')).toBe(true);
            expect(hasPermission(readOnly, 'invoices.read')).toBe(true);
            expect(hasPermission(readOnly, 'products.read')).toBe(true);
        });

        it('should return false for write permissions', () => {
            expect(hasPermission(readOnly, 'subscriptions.write')).toBe(false);
            expect(hasPermission(readOnly, 'customers.write')).toBe(false);
        });
    });
});

