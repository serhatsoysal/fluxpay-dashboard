import { FC, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePayments, usePaymentStats } from '../api/paymentsQueries';
import { PaymentStatus, PaymentMethod } from '../types/payment.types';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { ROUTES } from '@/shared/constants/routes';

export const PaymentsPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(0);
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    const filters = useMemo(() => ({
        page: page,
        size: 20,
        status: activeFilter !== 'All'
            ? activeFilter.toUpperCase().replace(/ /g, '_') as PaymentStatus
            : undefined,
        paymentMethod: paymentMethodFilter !== 'All'
            ? paymentMethodFilter.toUpperCase().replace(/ /g, '_') as PaymentMethod
            : undefined,
    }), [activeFilter, paymentMethodFilter, page]);

    const { data, isLoading } = usePayments(filters);
    const { data: stats } = usePaymentStats();
    const payments = data?.content || [];

    const getPaymentStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'REFUNDED':
            case 'PARTIALLY_REFUNDED':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'CANCELED':
                return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-600';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
        }
    };

    const getPaymentStatusDot = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'bg-emerald-500';
            case 'PROCESSING': return 'bg-blue-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'FAILED': return 'bg-red-500';
            case 'REFUNDED':
            case 'PARTIALLY_REFUNDED': return 'bg-purple-500';
            case 'CANCELED': return 'bg-slate-500';
            default: return 'bg-slate-400';
        }
    };

    const getAvatarColor = (initial: string) => {
        const colors = [
            'bg-indigo-100 text-indigo-600',
            'bg-purple-100 text-purple-600',
            'bg-pink-100 text-pink-600',
            'bg-cyan-100 text-cyan-600',
            'bg-yellow-100 text-yellow-600'
        ];
        const index = initial.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getCustomerInitials = (name: string, email: string) => {
        if (name) {
            const parts = name.trim().split(' ');
            if (parts.length === 1) {
                return parts[0].substring(0, 2).toUpperCase();
            }
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span>Dashboard</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">Payments</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Payments</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">View and manage all payment transactions and refunds.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => {
                                const csvContent = [
                                    ['Transaction ID', 'Customer', 'Amount', 'Currency', 'Status', 'Payment Method', 'Paid At', 'Created'].join(','),
                                    ...payments.map((payment: any) => [
                                        payment.transactionId || payment.id,
                                        `"${payment.customerEmail || payment.customerName || 'Unknown'}"`,
                                        (payment.amount || 0) / 100,
                                        payment.currency || 'USD',
                                        payment.status || '',
                                        payment.paymentMethod || '',
                                        payment.paidAt || '',
                                        payment.createdAt || ''
                                    ].join(','))
                                ].join('\n');
                                
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm min-w-[160px]"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                            Export
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency((stats?.totalRevenue || 0) * 100, stats?.currency || 'USD')}
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.completedCount || 0}</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.failedCount || 0}</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</span>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.pendingCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-transparent">
                        <div className="flex gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto">
                            {['All', 'Completed', 'Processing', 'Pending', 'Failed', 'Refunded'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={cn(
                                        "pb-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                                        activeFilter === filter
                                            ? "border-primary text-primary font-semibold"
                                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative group flex-1 sm:flex-none">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">search</span>
                                <input
                                    type="text"
                                    placeholder="Filter payments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-xs text-slate-500">
                                    <tr>
                                        <th className="w-10 px-6 py-4">
                                            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800" />
                                        </th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Transaction ID</th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Customer</th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Amount</th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Status</th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Payment Method</th>
                                        <th className="px-6 py-4 font-medium tracking-wide">Paid At</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-slate-500">Loading payments...</td>
                                        </tr>
                                    ) : payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">payments</span>
                                                    <p>No payments found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : payments.map((payment: any) => {
                                        const customerName = payment.customerName || payment.customerEmail || 'Unknown';
                                        const customerInitials = getCustomerInitials(customerName, payment.customerEmail || '');
                                        return (
                                            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer" onClick={() => navigate(ROUTES.PAYMENT_DETAIL.replace(':id', payment.id))}>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100" />
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-900 dark:text-white text-xs">
                                                    {payment.transactionId || payment.id.substring(0, 8)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {customerInitials && (
                                                            <div className={cn("size-5 rounded-full flex items-center justify-center text-[10px] font-bold", getAvatarColor(customerInitials))}>
                                                                {customerInitials}
                                                            </div>
                                                        )}
                                                        <span className="text-slate-900 dark:text-white">{customerName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(payment.amount || 0, payment.currency || 'USD')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', getPaymentStatusStyle(payment.status))}>
                                                        <span className={cn('size-1.5 rounded-full', getPaymentStatusDot(payment.status))}></span>
                                                        {payment.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {payment.paymentMethod?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <button 
                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(ROUTES.PAYMENT_DETAIL.replace(':id', payment.id));
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Viewing <span className="font-medium text-slate-900 dark:text-white">{page * 20 + 1}-{Math.min((page + 1) * 20, data?.totalElements || payments.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{data?.totalElements || payments.length}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!data || (page + 1) * 20 >= (data.totalElements || 0)}
                                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

