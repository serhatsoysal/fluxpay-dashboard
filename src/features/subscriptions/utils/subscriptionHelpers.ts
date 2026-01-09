import { format } from 'date-fns';

export const formatSubscriptionStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'ACTIVE': 'Active',
        'PAST_DUE': 'Past Due',
        'TRIALING': 'Trialing',
        'PAUSED': 'Paused',
        'CANCELED': 'Canceled',
        'INCOMPLETE': 'Incomplete',
        'INCOMPLETE_EXPIRED': 'Incomplete Expired',
        'UNPAID': 'Unpaid',
        'active': 'Active',
        'past_due': 'Past Due',
        'trialing': 'Trialing',
        'paused': 'Paused',
        'canceled': 'Canceled',
        'incomplete': 'Incomplete',
        'incomplete_expired': 'Incomplete Expired',
        'unpaid': 'Unpaid',
    };
    return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toUpperCase();
    
    switch (normalizedStatus) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'PAST_DUE':
        case 'UNPAID':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        case 'TRIALING':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        case 'PAUSED':
        case 'CANCELED':
            return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
        default:
            return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
};

export const getStatusDotColor = (status: string): string => {
    const normalizedStatus = status.toUpperCase();
    
    switch (normalizedStatus) {
        case 'ACTIVE':
            return 'bg-green-500';
        case 'PAST_DUE':
        case 'UNPAID':
            return 'bg-red-500';
        case 'TRIALING':
            return 'bg-orange-500';
        case 'PAUSED':
        case 'CANCELED':
            return 'bg-slate-400';
        default:
            return 'bg-slate-400';
    }
};

export const calculateMRR = (subscriptions: any[]): number => {
    return subscriptions.reduce((total, sub) => {
        if (sub.status?.toUpperCase() === 'ACTIVE' || sub.status?.toUpperCase() === 'TRIALING') {
            const amount = sub.amount || 0;
            const interval = sub.interval?.toLowerCase() || 'month';
            
            switch (interval) {
                case 'year':
                case 'yearly':
                    return total + (amount / 12);
                case 'month':
                case 'monthly':
                    return total + amount;
                case 'week':
                case 'weekly':
                    return total + (amount * 4.33);
                case 'day':
                case 'daily':
                    return total + (amount * 30);
                default:
                    return total + amount;
            }
        }
        return total;
    }, 0);
};

export const calculateChurnRate = (subscriptions: any[], canceledSubscriptions: any[]): number => {
    const totalSubscriptions = subscriptions.length;
    const canceled = canceledSubscriptions.length;
    
    if (totalSubscriptions === 0) return 0;
    return (canceled / totalSubscriptions) * 100;
};

export const getCustomerInitials = (name: string): string => {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    const amountInDollars = amount / 100;
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amountInDollars);
};

export const formatNextBilling = (dateString: string): string => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return format(date, 'MMM dd, yyyy');
    } catch {
        return dateString;
    }
};

export const generateSparklineData = (length: number = 12): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
};

