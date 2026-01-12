import { FC, useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useSubscriptions } from '@/features/subscriptions/api/subscriptionsQueries';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { cn } from '@/shared/utils/cn';
import { CreateCustomerDialog } from '../components/CreateCustomerDialog';

interface Customer {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'past_due' | 'canceled';
    totalSpend: number;
    currentPlan: string;
    dateAdded: string;
    lastInvoice: string;
    initials: string;
    gradient: string;
}

export const CustomersPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [planFilter, setPlanFilter] = useState<string>('All');
    const [createdFilter, setCreatedFilter] = useState<string>('Any time');
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [isCreatedOpen, setIsCreatedOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const planRef = useRef<HTMLDivElement>(null);
    const createdRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        setSearchQuery((prev) => {
            if (urlSearch !== prev) {
                return urlSearch;
            }
            return prev;
        });
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (planRef.current && !planRef.current.contains(event.target as Node)) {
                setIsPlanOpen(false);
            }
            if (createdRef.current && !createdRef.current.contains(event.target as Node)) {
                setIsCreatedOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        setSearchParams(params, { replace: true });
    };

    const { data: subscriptionsData } = useSubscriptions({ page: 0, size: 1000 });
    const subscriptions = subscriptionsData?.content || [];

    const customers = useMemo(() => {
        const customerMap = new Map<string, Customer>();

        subscriptions.forEach((sub: any) => {
            const customerId = sub.customerId;
            const existing = customerMap.get(customerId);

            const status = sub.status?.toLowerCase() || 'active';
            const plan = sub.productName || 'Standard';
            const amount = (sub.amount || 0) / 100;
            const dateAdded = sub.createdAt || new Date().toISOString();
            
            const name = sub.customerName || 'Unknown Customer';
            const email = sub.customerEmail || `${customerId}@example.com`;
            const initials = name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'UC';

            const gradientMap: Record<string, string> = {
                'AC': 'from-purple-500 to-indigo-600',
                'SI': 'from-red-500 to-orange-600',
                'WE': 'from-gray-800 to-black',
                'CS': 'from-cyan-500 to-blue-600',
                'OS': 'from-emerald-600 to-green-700',
            };

            const gradient = gradientMap[initials] || 'from-slate-600 to-slate-800';

            if (existing) {
                existing.totalSpend += amount;
                if (status === 'active' && existing.status !== 'active') {
                    existing.status = status as 'active' | 'past_due' | 'canceled';
                }
                if (plan !== existing.currentPlan) {
                    existing.currentPlan = plan;
                }
            } else {
                customerMap.set(customerId, {
                    id: customerId,
                    name,
                    email,
                    status: status as 'active' | 'past_due' | 'canceled',
                    totalSpend: amount,
                    currentPlan: plan,
                    dateAdded,
                    lastInvoice: `INV-${customerId.slice(0, 3).toUpperCase()}`,
                    initials,
                    gradient,
                });
            }
        });

        return Array.from(customerMap.values());
    }, [subscriptions]);

    const availablePlans = useMemo(() => {
        const plans = new Set<string>();
        customers.forEach(c => plans.add(c.currentPlan));
        return Array.from(plans).sort();
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        let filtered = customers;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.email.toLowerCase().includes(query) ||
                    c.id.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'All') {
            const statusMap: Record<string, string> = {
                'Active': 'active',
                'Past Due': 'past_due',
                'Canceled': 'canceled',
            };
            filtered = filtered.filter((c) => c.status === statusMap[statusFilter]);
        }

        if (planFilter !== 'All') {
            filtered = filtered.filter((c) => c.currentPlan === planFilter);
        }

        if (createdFilter !== 'Any time') {
            const now = new Date();
            filtered = filtered.filter((customer) => {
                if (!customer.dateAdded) return false;
                try {
                    const createdDate = new Date(customer.dateAdded);
                    if (isNaN(createdDate.getTime())) {
                        return false;
                    }
                    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    switch (createdFilter) {
                        case 'Last week':
                            return diffDays <= 7;
                        case 'Last month':
                            return diffDays <= 30;
                        case 'Last year':
                            return diffDays <= 365;
                        default:
                            return true;
                    }
                } catch {
                    return false;
                }
            });
        }

        return filtered;
    }, [customers, searchQuery, statusFilter, planFilter, createdFilter]);

    const paginatedCustomers = useMemo(() => {
        const start = page * 20;
        const end = start + 20;
        return filteredCustomers.slice(start, end);
    }, [filteredCustomers, page]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Active
                    </span>
                );
            case 'past_due':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        Past Due
                    </span>
                );
            case 'canceled':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                        Canceled
                    </span>
                );
            default:
                return null;
        }
    };

    const getPlanIcon = (plan: string) => {
        const planLower = plan.toLowerCase();
        if (planLower.includes('enterprise')) {
            return { icon: 'domain', color: 'text-indigo-600' };
        }
        if (planLower.includes('legacy')) {
            return { icon: 'history', color: 'text-amber-600' };
        }
        if (planLower.includes('startup')) {
            return { icon: 'rocket_launch', color: 'text-blue-600' };
        }
        if (planLower.includes('growth')) {
            return { icon: 'trending_up', color: 'text-teal-600' };
        }
        return { icon: 'star', color: 'text-slate-400' };
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Customers</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customers</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage your customer base, track subscription status, and handle billing orchestration.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            const csvContent = [
                                ['Customer Name', 'Email', 'Status', 'Total Spend', 'Current Plan', 'Date Added', 'Last Invoice'].join(','),
                                ...filteredCustomers.map((customer) => [
                                    `"${customer.name}"`,
                                    `"${customer.email}"`,
                                    customer.status,
                                    customer.totalSpend,
                                    `"${customer.currentPlan}"`,
                                    customer.dateAdded,
                                    customer.lastInvoice
                                ].join(','))
                            ].join('\n');
                            
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
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
                        Add customer
                    </button>
                </div>
            </header>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex w-full max-w-md items-center rounded-lg bg-white border border-slate-200 px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-slate-400 mr-2" style={{ fontSize: '20px' }}>search</span>
                    <input
                        className="w-full bg-transparent border-none p-0 text-sm text-slate-900 placeholder-slate-400 focus:ring-0"
                        placeholder="Search by email, name, or UID..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <div className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-medium">/</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1">
                        <span className="text-slate-500 text-sm font-medium">Filter by:</span>
                    </div>
                    <button
                        onClick={() => setStatusFilter(statusFilter === 'All' ? 'Active' : statusFilter === 'Active' ? 'Past Due' : statusFilter === 'Past Due' ? 'Canceled' : 'All')}
                        className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 px-3 py-1.5 transition-colors shadow-sm"
                    >
                        <span className="text-sm font-medium text-slate-600">Status:</span>
                        <span className="text-sm font-medium text-slate-900">{statusFilter}</span>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors" style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                    </button>
                    <div ref={planRef} className="relative">
                        <button 
                            onClick={() => setIsPlanOpen(!isPlanOpen)}
                            className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 px-3 py-1.5 transition-colors shadow-sm"
                        >
                            <span className="text-sm font-medium text-slate-600">Plan:</span>
                            <span className="text-sm font-medium text-slate-900">{planFilter}</span>
                            <span className={cn("material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors", isPlanOpen && "rotate-180")} style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                        </button>
                        {isPlanOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                                <button
                                    onClick={() => {
                                        setPlanFilter('All');
                                        setIsPlanOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                        planFilter === 'All'
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    All
                                </button>
                                {availablePlans.map((plan) => (
                                    <button
                                        key={plan}
                                        onClick={() => {
                                            setPlanFilter(plan);
                                            setIsPlanOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                            planFilter === plan
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {plan}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div ref={createdRef} className="relative">
                        <button 
                            onClick={() => setIsCreatedOpen(!isCreatedOpen)}
                            className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 px-3 py-1.5 transition-colors shadow-sm"
                        >
                            <span className="text-sm font-medium text-slate-600">Created:</span>
                            <span className="text-sm font-medium text-slate-900">{createdFilter}</span>
                            <span className={cn("material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors", isCreatedOpen && "rotate-180")} style={{ fontSize: '18px' }}>keyboard_arrow_down</span>
                        </button>
                        {isCreatedOpen && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                                {['Any time', 'Last week', 'Last month', 'Last year'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            setCreatedFilter(time);
                                            setIsCreatedOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                            createdFilter === time
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <button className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>view_column</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900 w-1/4">Customer</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Status</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900 text-right">Total Spend</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Current Plan</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Date Added</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Last Invoice</th>
                                <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-900 text-right w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((customer) => {
                                    const planInfo = getPlanIcon(customer.currentPlan);
                                    return (
                                        <tr 
                                            key={customer.id} 
                                            className="group hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).closest('button')) return;
                                                navigate(ROUTES.CUSTOMER_DETAIL.replace(':id', customer.id));
                                            }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-10 w-10 shrink-0 overflow-hidden rounded-full", `bg-gradient-to-br ${customer.gradient}`)}>
                                                        <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
                                                            {customer.initials}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">{customer.name}</span>
                                                        <span className="text-xs text-slate-500">{customer.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(customer.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-medium text-slate-900 font-mono">{formatCurrency(customer.totalSpend, 'USD')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("material-symbols-outlined", planInfo.color)} style={{ fontSize: '18px' }}>{planInfo.icon}</span>
                                                    <span className="text-sm text-slate-600">{customer.currentPlan}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-500">{formatDate(customer.dateAdded)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>description</span>
                                                    <span className="text-sm text-slate-600">{customer.lastInvoice}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                    <span className="material-symbols-outlined">more_horiz</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{paginatedCustomers.length > 0 ? page * 20 + 1 : 0}</span> to <span className="font-medium text-slate-900">{Math.min((page + 1) * 20, filteredCustomers.length)}</span> of <span className="font-medium text-slate-900">{filteredCustomers.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                            <button 
                                onClick={() => setPage(p => p + 1)}
                                disabled={paginatedCustomers.length < 20 || (page + 1) * 20 >= filteredCustomers.length}
                                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                    </div>
                </div>
            </div>
            </div>
            <CreateCustomerDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    window.location.reload();
                }}
            />
        </div>
    );
};
