import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/features/subscriptions/api/subscriptionsQueries';
import {
    formatSubscriptionStatus,
    calculateMRR,
    formatCurrency,
    formatNextBilling,
} from '@/features/subscriptions/utils/subscriptionHelpers';
import { cn } from '@/shared/utils/cn';
import { ROUTES } from '@/shared/constants/routes';

export const DashboardPage: FC = () => {
    const [dateFilter, setDateFilter] = useState<string>('Year to Date');
    const navigate = useNavigate();
    
    const { data: subscriptionsData } = useSubscriptions({ page: 0, size: 5 });
    const subscriptions = subscriptionsData?.content || [];

    const mrr = useMemo(() => calculateMRR(subscriptions), [subscriptions]);
    const activeSubscribers = useMemo(() =>
        subscriptions.filter((s: any) => s.status?.toUpperCase() === 'ACTIVE' || s.status?.toUpperCase() === 'TRIALING').length,
        [subscriptions]
    );

    const recentSubscriptions = useMemo(() => {
        return subscriptions.slice(0, 5).map((sub: any) => ({
            customer: sub.customerName || 'Unknown',
            plan: sub.productName || 'Standard Plan',
            amount: formatCurrency(sub.amount || 0, sub.currency || 'USD'),
            status: formatSubscriptionStatus(sub.status || ''),
            date: formatNextBilling(sub.currentPeriodEnd || sub.createdAt || ''),
            id: sub.id,
        }));
    }, [subscriptions]);

    const getStatusBadgeClass = (status: string) => {
        const normalizedStatus = status.toUpperCase();
        switch (normalizedStatus) {
            case 'ACTIVE':
                return 'inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
            case 'TRIALING':
                return 'inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20';
            case 'PAST_DUE':
            case 'PAST DUE':
                return 'inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10';
            default:
                return 'inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-6 sm:gap-8">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                        <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl">Overview of your financial performance.</p>
                </div>
                <div className="flex items-center rounded-lg bg-white dark:bg-slate-800 p-1 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-x-auto">
                    <button
                        onClick={() => setDateFilter('Last 30 Days')}
                        className={cn(
                            "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors touch-manipulation min-h-[36px] whitespace-nowrap",
                            dateFilter === 'Last 30 Days'
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setDateFilter('Year to Date')}
                        className={cn(
                            "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors touch-manipulation min-h-[36px] whitespace-nowrap",
                            dateFilter === 'Year to Date'
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                    >
                        Year to Date
                    </button>
                    <button
                        onClick={() => setDateFilter('Custom')}
                        className={cn(
                            "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors touch-manipulation min-h-[36px] whitespace-nowrap",
                            dateFilter === 'Custom'
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                    >
                        Custom
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">MRR</p>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600" style={{ fontSize: '18px' }}>attach_money</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {formatCurrency(mrr * 100, 'USD')}
                        </span>
                        <span className="inline-flex items-baseline rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <span className="material-symbols-outlined mr-0.5 self-center" style={{ fontSize: '12px' }}>arrow_upward</span>
                            12.5%
                        </span>
                    </div>
                    <div className="mt-4 h-10 w-full overflow-hidden">
                        <svg className="h-full w-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 200 40">
                            <path d="M0 30 C 20 28, 40 10, 60 15 C 80 20, 100 5, 120 10 C 140 15, 160 5, 180 2 C 190 0, 200 0, 200 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <defs>
                                <linearGradient id="gradient-mrr" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#3c83f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3c83f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path className="opacity-30" d="M0 30 C 20 28, 40 10, 60 15 C 80 20, 100 5, 120 10 C 140 15, 160 5, 180 2 C 190 0, 200 0, 200 0 L 200 40 L 0 40 Z" fill="url(#gradient-mrr)" />
                        </svg>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscribers</p>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600" style={{ fontSize: '18px' }}>people</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{activeSubscribers}</span>
                        <span className="inline-flex items-baseline rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <span className="material-symbols-outlined mr-0.5 self-center" style={{ fontSize: '12px' }}>arrow_upward</span>
                            45
                        </span>
                    </div>
                    <div className="mt-4 h-10 w-full overflow-hidden">
                        <svg className="h-full w-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 200 40">
                            <path d="M0 35 C 30 35, 50 25, 80 28 C 110 31, 130 15, 160 18 C 180 20, 190 10, 200 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <defs>
                                <linearGradient id="gradient-subs" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#3c83f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3c83f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path className="opacity-30" d="M0 35 C 30 35, 50 25, 80 28 C 110 31, 130 15, 160 18 C 180 20, 190 10, 200 8 L 200 40 L 0 40 Z" fill="url(#gradient-subs)" />
                        </svg>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Churn Rate</p>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600" style={{ fontSize: '18px' }}>trending_down</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">2.1%</span>
                        <span className="inline-flex items-baseline rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <span className="material-symbols-outlined mr-0.5 self-center" style={{ fontSize: '12px' }}>arrow_downward</span>
                            0.4%
                        </span>
                    </div>
                    <div className="mt-4 h-10 w-full overflow-hidden">
                        <svg className="h-full w-full text-slate-400" fill="none" preserveAspectRatio="none" viewBox="0 0 200 40">
                            <path d="M0 10 C 20 12, 40 15, 60 18 C 80 21, 100 25, 120 22 C 140 19, 160 30, 180 35 C 190 38, 200 38, 200 40" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-col rounded-xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-sm sm:text-base font-semibold leading-6 text-slate-900 dark:text-white">Recent Subscriptions</h3>
                    <button
                        onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                        className="text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors touch-manipulation"
                    >
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-900 dark:text-white" scope="col">Customer</th>
                                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-900 dark:text-white hidden sm:table-cell" scope="col">Plan</th>
                                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-900 dark:text-white" scope="col">Amount</th>
                                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-900 dark:text-white" scope="col">Status</th>
                                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-900 dark:text-white hidden md:table-cell" scope="col">Date</th>
                                <th className="relative px-3 sm:px-6 py-3" scope="col">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {recentSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                        No subscriptions found
                                    </td>
                                </tr>
                            ) : (
                                recentSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-slate-100 dark:bg-slate-700 bg-cover bg-center flex-shrink-0" />
                                                <div className="font-medium text-slate-900 dark:text-white truncate">
                                                    <div>{sub.customer}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{sub.plan}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-600 dark:text-slate-300 hidden sm:table-cell">{sub.plan}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 dark:text-white">{sub.amount}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <span className={getStatusBadgeClass(sub.status)}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{sub.date}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center">
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                        Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{recentSubscriptions.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{subscriptionsData?.totalElements || recentSubscriptions.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={true}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[36px]"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 touch-manipulation min-h-[36px]"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <footer className="mt-8 sm:mt-12 mb-4 sm:mb-6 text-center text-xs text-slate-400 dark:text-slate-500">
                <p>© 2023 FluxPay Inc. All rights reserved.</p>
            </footer>
            </div>
        </div>
    );
};
