import { FC, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useInvoices } from '../api/invoicesQueries';
import { InvoiceStatus } from '../types/invoice.types';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { cn } from '@/shared/utils/cn';

export const InvoicesPage: FC = () => {
    const [searchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    const filters = useMemo(() => ({
        page: 0,
        size: 20,
        search: debouncedSearch,
        status: activeFilter !== 'All'
            ? activeFilter.toLowerCase().replace(' ', '_') as InvoiceStatus
            : undefined,
    }), [activeFilter, debouncedSearch]);

    const { data, stats, isLoading } = useInvoices(filters);
    const invoices = data?.content || [];

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
            case 'draft':
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

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Invoices</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Invoices</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage and track all customer payments and invoice history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm min-w-[160px]">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                        Export
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all min-w-[160px]">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Create Invoice
                    </button>
                </div>
             </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outstanding</span>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(stats.totalOutstanding * 100, 'USD')}
                        </span>
                        <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", stats.totalOutstandingChange >= 0 ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400")}>
                            {stats.totalOutstandingChange > 0 ? '+' : ''}{stats.totalOutstandingChange}%
                        </span>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past Due</span>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(stats.pastDue * 100, 'USD')}
                        </span>
                        <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", stats.pastDueChange <= 0 ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400")}>
                            {stats.pastDueChange > 0 ? '+' : ''}{stats.pastDueChange}%
                        </span>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Payment Time</span>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgPaymentTime} days</span>
                        <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", stats.avgPaymentTimeChange <= 0 ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400")}>
                            {stats.avgPaymentTimeChange} day
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-transparent">
                    <div className="flex gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto">
                        {['All', 'Draft', 'Open', 'Paid', 'Uncollectible'].map((filter) => (
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
                                placeholder="Filter invoices..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        </button>
                        <button className="p-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-xs text-slate-500">
                                <tr>
                                    <th className="w-10 px-6 py-4">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800" />
                                    </th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Amount</th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Status</th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Invoice #</th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Customer</th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Due Date</th>
                                    <th className="px-6 py-4 font-medium tracking-wide">Created</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500">Loading invoices...</td>
                                    </tr>
                                ) : invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100" />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(inv.amount * 100, inv.currency)}
                                            <span className="text-xs font-normal text-slate-400 ml-1">{inv.currency}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', getInvoiceStatusStyle(inv.status))}>
                                                <span className={cn('size-1.5 rounded-full', getInvoiceStatusDot(inv.status))}></span>
                                                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1).replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {inv.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {inv.customerInitials ? (
                                                    <div className={cn("size-5 rounded-full flex items-center justify-center text-[10px] font-bold", getAvatarColor(inv.customerInitials || ''))}>
                                                        {inv.customerInitials}
                                                    </div>
                                                ) : (
                                                    <div className="size-5"></div>
                                                )}
                                                {inv.customerEmail}
                                            </div>
                                        </td>
                                        <td className={cn("px-6 py-4 text-slate-500", inv.status === 'past_due' && "text-red-600 font-medium")}>
                                            {inv.dueDate}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {inv.createdDate}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Viewing <span className="font-medium text-slate-900 dark:text-white">1-{invoices.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{1432}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                            <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};
