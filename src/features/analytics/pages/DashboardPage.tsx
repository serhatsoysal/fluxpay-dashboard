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
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Overview of your financial performance.</p>
                </div>
                <div className="flex items-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
                    <button
                        onClick={() => setDateFilter('Last 30 Days')}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            dateFilter === 'Last 30 Days'
                                ? "bg-slate-100 text-slate-900 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setDateFilter('Year to Date')}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            dateFilter === 'Year to Date'
                                ? "bg-slate-100 text-slate-900 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        Year to Date
                    </button>
                    <button
                        onClick={() => setDateFilter('Custom')}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            dateFilter === 'Custom'
                                ? "bg-slate-100 text-slate-900 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        Custom
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">MRR</p>
                        <span className="material-symbols-outlined text-slate-300" style={{ fontSize: '20px' }}>attach_money</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
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

                <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Active Subscribers</p>
                        <span className="material-symbols-outlined text-slate-300" style={{ fontSize: '20px' }}>people</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">{activeSubscribers}</span>
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

                <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-200 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Churn Rate</p>
                        <span className="material-symbols-outlined text-slate-300" style={{ fontSize: '20px' }}>trending_down</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">2.1%</span>
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

            <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h3 className="text-base font-semibold leading-6 text-slate-900">Recent Subscriptions</h3>
                    <button
                        onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-900" scope="col">Customer</th>
                                <th className="px-6 py-3 font-semibold text-slate-900" scope="col">Plan</th>
                                <th className="px-6 py-3 font-semibold text-slate-900" scope="col">Amount</th>
                                <th className="px-6 py-3 font-semibold text-slate-900" scope="col">Status</th>
                                <th className="px-6 py-3 font-semibold text-slate-900" scope="col">Date</th>
                                <th className="relative px-6 py-3" scope="col">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {recentSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No subscriptions found
                                    </td>
                                </tr>
                            ) : (
                                recentSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 bg-cover bg-center" />
                                                <div className="font-medium text-slate-900">{sub.customer}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{sub.plan}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{sub.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadgeClass(sub.status)}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{sub.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{recentSubscriptions.length}</span> of <span className="font-medium text-slate-900">{subscriptionsData?.totalElements || recentSubscriptions.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                        <button
                            onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <footer className="mt-12 mb-6 text-center text-xs text-slate-400">
                <p>© 2023 FluxPay Inc. All rights reserved.</p>
            </footer>
            </div>
        </div>
    );
};
