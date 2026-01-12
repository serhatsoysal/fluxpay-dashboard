import { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '@/features/subscriptions/api/subscriptionsApi';
import { invoicesApi } from '@/features/invoices/api/invoicesApi';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import {
    formatSubscriptionStatus,
    getStatusColor,
    getStatusDotColor,
    getCustomerInitials,
} from '@/features/subscriptions/utils/subscriptionHelpers';

export const CustomerDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data: subscriptions = [], isLoading: subscriptionsLoading } = useQuery({
        queryKey: ['subscriptions', 'customer', id],
        queryFn: async () => {
            const response = await subscriptionsApi.getAll({ customerId: id || '', page: 0, size: 100 });
            return response.content || [];
        },
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
        queryKey: ['invoices', 'customer', id],
        queryFn: () => invoicesApi.getByCustomer(id || ''),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const customerName = subscriptions[0]?.customerName || 'Customer';
    const customerEmail = subscriptions[0]?.customerId || id || '';
    const isLoading = subscriptionsLoading || invoicesLoading;

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-slate-500 dark:text-slate-400">Loading customer...</div>
                    </div>
                </div>
            </div>
        );
    }

    const getInvoiceStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'past_due':
                return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'void':
                return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-600';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
        }
    };

    const getInvoiceStatusDot = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-emerald-500';
            case 'open': return 'bg-blue-500';
            case 'past_due': return 'bg-red-500';
            case 'void': return 'bg-slate-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.CUSTOMERS} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Customers
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{customerName}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            {getCustomerInitials(customerName)}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {customerName}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                {customerEmail}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Subscriptions</h2>
                            {subscriptions.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No subscriptions found</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Billing</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {subscriptions.map((sub: any) => (
                                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="py-3 text-sm text-slate-900 dark:text-white">
                                                        {sub.productName || 'Standard Plan'}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', getStatusColor(sub.status || ''))}>
                                                            <div className={cn('size-1.5 rounded-full mr-1.5', getStatusDotColor(sub.status || ''))}></div>
                                                            {formatSubscriptionStatus(sub.status || '')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white">
                                                        {formatCurrency(sub.amount || 0, sub.currency || 'USD')}
                                                        {sub.interval && ` / ${sub.interval}`}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                                                        {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : '-'}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            to={ROUTES.SUBSCRIPTION_DETAIL.replace(':id', sub.id)}
                                                            className="text-primary hover:text-primary-dark text-sm font-medium"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Invoice History</h2>
                            {invoices.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No invoices found</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {invoices.map((inv: any) => (
                                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="py-3 text-sm font-medium text-slate-900 dark:text-white">
                                                        {inv.invoiceNumber || inv.id}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', getInvoiceStatusStyle(inv.status || ''))}>
                                                            <span className={cn('size-1.5 rounded-full mr-1.5', getInvoiceStatusDot(inv.status || ''))}></span>
                                                            {inv.status?.charAt(0).toUpperCase() + inv.status?.slice(1).replace('_', ' ') || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                                                        {formatCurrency((inv.total || inv.amount || 0) * 100, inv.currency || 'USD')}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                                                        {inv.invoiceDate ? formatDate(inv.invoiceDate) : inv.createdDate ? formatDate(inv.createdDate) : '-'}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            to={ROUTES.INVOICE_DETAIL.replace(':id', inv.id)}
                                                            className="text-primary hover:text-primary-dark text-sm font-medium"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer Information</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer ID</dt>
                                    <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{id || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{customerEmail}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscriptions</dt>
                                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                        {subscriptions.filter((s: any) => s.status?.toUpperCase() === 'ACTIVE' || s.status?.toUpperCase() === 'TRIALING').length}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Invoices</dt>
                                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{invoices.length}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

