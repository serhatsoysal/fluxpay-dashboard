import { describe, it, expect } from 'vitest';
import {
    formatSubscriptionStatus,
    getStatusColor,
    getStatusDotColor,
    calculateMRR,
    calculateChurnRate,
    getCustomerInitials,
    formatCurrency,
    formatNextBilling,
    generateSparklineData,
} from './subscriptionHelpers';

describe('subscriptionHelpers', () => {
    describe('formatSubscriptionStatus', () => {
        it('should format uppercase statuses', () => {
            expect(formatSubscriptionStatus('ACTIVE')).toBe('Active');
            expect(formatSubscriptionStatus('PAST_DUE')).toBe('Past Due');
            expect(formatSubscriptionStatus('TRIALING')).toBe('Trialing');
        });

        it('should format lowercase statuses', () => {
            expect(formatSubscriptionStatus('active')).toBe('Active');
            expect(formatSubscriptionStatus('past_due')).toBe('Past Due');
        });

        it('should return original status if not in map', () => {
            expect(formatSubscriptionStatus('UNKNOWN')).toBe('UNKNOWN');
        });
    });

    describe('getStatusColor', () => {
        it('should return green for ACTIVE', () => {
            const color = getStatusColor('ACTIVE');
            expect(color).toContain('green');
        });

        it('should return red for PAST_DUE and UNPAID', () => {
            expect(getStatusColor('PAST_DUE')).toContain('red');
            expect(getStatusColor('UNPAID')).toContain('red');
        });

        it('should return orange for TRIALING', () => {
            expect(getStatusColor('TRIALING')).toContain('orange');
        });

        it('should return slate for PAUSED and CANCELED', () => {
            expect(getStatusColor('PAUSED')).toContain('slate');
            expect(getStatusColor('CANCELED')).toContain('slate');
        });

        it('should return default for unknown status', () => {
            expect(getStatusColor('UNKNOWN')).toContain('slate');
        });
    });

    describe('getStatusDotColor', () => {
        it('should return correct dot colors', () => {
            expect(getStatusDotColor('ACTIVE')).toBe('bg-green-500');
            expect(getStatusDotColor('PAST_DUE')).toBe('bg-red-500');
            expect(getStatusDotColor('TRIALING')).toBe('bg-orange-500');
            expect(getStatusDotColor('PAUSED')).toBe('bg-slate-400');
        });
    });

    describe('calculateMRR', () => {
        it('should calculate MRR for monthly subscriptions', () => {
            const subscriptions = [
                { status: 'ACTIVE', amount: 10000, interval: 'month' },
                { status: 'TRIALING', amount: 20000, interval: 'monthly' },
            ];
            expect(calculateMRR(subscriptions)).toBe(30000);
        });

        it('should convert yearly to monthly', () => {
            const subscriptions = [
                { status: 'ACTIVE', amount: 120000, interval: 'year' },
            ];
            expect(calculateMRR(subscriptions)).toBe(10000);
        });

        it('should convert weekly to monthly', () => {
            const subscriptions = [
                { status: 'ACTIVE', amount: 1000, interval: 'week' },
            ];
            expect(calculateMRR(subscriptions)).toBeCloseTo(4330);
        });

        it('should convert daily to monthly', () => {
            const subscriptions = [
                { status: 'ACTIVE', amount: 100, interval: 'day' },
            ];
            expect(calculateMRR(subscriptions)).toBe(3000);
        });

        it('should ignore non-active subscriptions', () => {
            const subscriptions = [
                { status: 'CANCELED', amount: 10000, interval: 'month' },
                { status: 'ACTIVE', amount: 20000, interval: 'month' },
            ];
            expect(calculateMRR(subscriptions)).toBe(20000);
        });

        it('should default to monthly if interval is missing', () => {
            const subscriptions = [
                { status: 'ACTIVE', amount: 10000 },
            ];
            expect(calculateMRR(subscriptions)).toBe(10000);
        });
    });

    describe('calculateChurnRate', () => {
        it('should calculate churn rate correctly', () => {
            const subscriptions = [{ id: '1' }, { id: '2' }, { id: '3' }];
            const canceled = [{ id: '1' }];
            expect(calculateChurnRate(subscriptions, canceled)).toBeCloseTo(33.33, 1);
        });

        it('should return 0 if no subscriptions', () => {
            expect(calculateChurnRate([], [])).toBe(0);
        });

        it('should return 100 if all canceled', () => {
            const subscriptions = [{ id: '1' }, { id: '2' }];
            const canceled = [{ id: '1' }, { id: '2' }];
            expect(calculateChurnRate(subscriptions, canceled)).toBe(100);
        });
    });

    describe('getCustomerInitials', () => {
        it('should return first two letters for single name', () => {
            expect(getCustomerInitials('John')).toBe('JO');
        });

        it('should return first and last initial for full name', () => {
            expect(getCustomerInitials('John Doe')).toBe('JD');
        });

        it('should handle multiple words', () => {
            expect(getCustomerInitials('John Michael Doe')).toBe('JD');
        });

        it('should return ?? for empty name', () => {
            expect(getCustomerInitials('')).toBe('??');
        });

        it('should handle whitespace', () => {
            expect(getCustomerInitials('  John  ')).toBe('JO');
        });
    });

    describe('formatCurrency', () => {
        it('should format USD correctly', () => {
            expect(formatCurrency(10000, 'USD')).toContain('$100.00');
        });

        it('should format EUR correctly', () => {
            const formatted = formatCurrency(5000, 'EUR');
            expect(formatted).toContain('50.00');
        });

        it('should default to USD', () => {
            expect(formatCurrency(10000)).toContain('$100.00');
        });
    });

    describe('formatNextBilling', () => {
        it('should format valid date', () => {
            const formatted = formatNextBilling('2024-01-15T00:00:00Z');
            expect(formatted).toMatch(/Jan \d{2}, 2024/);
        });

        it('should return - for empty string', () => {
            expect(formatNextBilling('')).toBe('-');
        });

        it('should return original string for invalid date', () => {
            expect(formatNextBilling('invalid')).toBe('invalid');
        });
    });

    describe('generateSparklineData', () => {
        it('should generate array of specified length', () => {
            const data = generateSparklineData(10);
            expect(data).toHaveLength(10);
        });

        it('should generate numbers', () => {
            const data = generateSparklineData(5);
            data.forEach(value => {
                expect(typeof value).toBe('number');
            });
        });

        it('should default to length 12', () => {
            const data = generateSparklineData();
            expect(data).toHaveLength(12);
        });
    });
});

