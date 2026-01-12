import { FC, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SubscriptionStatus, SubscriptionFilters } from '../types/subscription.types';
import { useSubscriptions } from '../api/subscriptionsQueries';
import { ROUTES } from '@/shared/constants/routes';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { RevenueRecognitionChart } from '../components/RevenueRecognitionChart';
import { APIKeyWidget } from '../components/APIKeyWidget';
import { CreateSubscriptionDialog } from '../components/CreateSubscriptionDialog';
import {
    formatSubscriptionStatus,
    getStatusColor,
    calculateMRR,
    getCustomerInitials,
    formatCurrency,
    formatNextBilling,
    getStatusDotColor,
} from '../utils/subscriptionHelpers';
import { cn } from '@/shared/utils/cn';

export const SubscriptionsPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<string>('Active');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(0);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    const filters = useMemo(() => {
        const filterMap: Record<string, SubscriptionStatus | undefined> = {
            'All': undefined,
            'Active': 'active',
            'Past Due': 'past_due',
            'Trialing': 'trialing',
            'Paused': 'paused',
            'Canceled': 'canceled',
        };
        
        const status = filterMap[activeFilter];
        
        const result: SubscriptionFilters = {
            page: page,
            size: 20,
        };
        
        if (status) {
            result.status = status;
        }
        
        return result;
    }, [activeFilter]);

    const { data, isLoading, error } = useSubscriptions(filters);

    const subscriptions = data?.content || [];

    const filteredSubscriptions = useMemo(() => {
        if (!debouncedSearch) return subscriptions;

        return subscriptions.filter((sub: any) =>
            sub.customerName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            sub.customerEmail?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            sub.id?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [subscriptions, debouncedSearch]);

    const mrr = useMemo(() => calculateMRR(subscriptions), [subscriptions]);
    const activeSubscribers = useMemo(() =>
        subscriptions.filter((s: any) => s.status?.toUpperCase() === 'ACTIVE' || s.status?.toUpperCase() === 'TRIALING').length,
        [subscriptions]
    );

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load subscriptions</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const sparklineData = [30, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100];

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Subscriptions</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Subscription Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage billing, upgrades, and subscription lifecycles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            const csvContent = [
                                ['Customer', 'Plan', 'Status', 'Amount', 'Currency', 'Next Billing', 'Created'].join(','),
                                ...filteredSubscriptions.map((sub: any) => [
                                    `"${sub.customerName || 'Unknown'}"`,
                                    `"${sub.productName || 'Standard Plan'}"`,
                                    sub.status || '',
                                    (sub.amount || 0) / 100,
                                    sub.currency || 'USD',
                                    sub.currentPeriodEnd || '',
                                    sub.createdAt || ''
                                ].join(','))
                            ].join('\n');
                            
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
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
                    <button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all min-w-[160px]"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Create Subscription
                    </button>
                </div>
             </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">MRR</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {formatCurrency(mrr * 100, 'USD')}
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-xs font-semibold text-green-700 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            12.5%
                        </span>
                    </div>
                    <div className="h-10 w-full flex items-end gap-1 opacity-50">
                        {sparklineData.map((height, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-1/12 rounded-t-sm",
                                    index === sparklineData.length - 1 ? "bg-primary/80" : "bg-primary"
                                )}
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Churn Rate</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0.8%</h3>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-xs font-semibold text-green-700 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                            0.2%
                        </span>
                    </div>
                    <div className="h-10 w-full relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                            <path d="M0 30 Q 20 35, 40 20 T 100 25" fill="none" stroke="#64748b" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscribers</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeSubscribers}</h3>
                        </div>
                        <div className="flex -space-x-2">
                            <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700" />
                            <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700" />
                            <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">+24</div>
                        </div>
                    </div>
                    <div className="h-10 w-full flex items-end justify-between px-1">
                        {[3, 5, 4, 7, 5, 8, 6, 9].map((height, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-2 rounded-sm",
                                    index === 7 ? "bg-primary/80" : "bg-slate-200 dark:bg-slate-700"
                                )}
                                style={{ height: `${height * 10}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueRecognitionChart />
                <APIKeyWidget />
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            Filter
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        {['All', 'Active', 'Past Due', 'Trialing'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                    activeFilter === filter
                                        ? "text-primary bg-primary/10"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Filter by email or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-slate-500 dark:text-slate-400">Loading subscriptions...</div>
                        </div>
                    ) : filteredSubscriptions.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-2">search_off</span>
                                <p className="text-slate-500 dark:text-slate-400">No subscriptions found</p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10">
                                        <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                    </th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Billing</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredSubscriptions.map((sub: any) => (
                                    <tr 
                                        key={sub.id} 
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            if ((e.target as HTMLElement).closest('button, input')) return;
                                            navigate(ROUTES.SUBSCRIPTION_DETAIL.replace(':id', sub.id));
                                        }}
                                    >
                                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                            <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {getCustomerInitials(sub.customerName || 'Unknown')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {sub.customerName || 'Unknown Customer'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {sub.customerEmail || sub.customerId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">
                                            {sub.productName || 'Standard Plan'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', getStatusColor(sub.status))}>
                                                <div className={cn('size-1.5 rounded-full mr-1.5', getStatusDotColor(sub.status))}></div>
                                                {formatSubscriptionStatus(sub.status)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">
                                            {formatNextBilling(sub.currentPeriodEnd)}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-mono text-slate-900 dark:text-white text-right">
                                            {formatCurrency(sub.amount || 0, sub.currency || 'USD')}
                                        </td>
                                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(ROUTES.SUBSCRIPTION_DETAIL.replace(':id', sub.id));
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {filteredSubscriptions.length > 0 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Showing {page * 20 + 1} to {Math.min((page + 1) * 20, data?.totalElements || filteredSubscriptions.length)} of {data?.totalElements || filteredSubscriptions.length} results</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setPage(p => p + 1)}
                                disabled={!data || (page + 1) * 20 >= (data.totalElements || 0)}
                                className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <CreateSubscriptionDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                }}
            />
        </div>
    );
};
