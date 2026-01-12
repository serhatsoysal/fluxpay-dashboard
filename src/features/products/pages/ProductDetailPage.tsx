import { FC, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useProductPrices } from '../api/productsQueries';
import { CreatePriceDialog } from '../components/CreatePriceDialog';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { Price, PricingModel, BillingInterval } from '../types/product.types';

export const ProductDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id || '');
    const { data: prices = [] } = useProductPrices(id || '');
    const [isCreatePriceDialogOpen, setIsCreatePriceDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-slate-500 dark:text-slate-400">Loading product...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load product</p>
                        <Link
                            to={ROUTES.PRODUCTS}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'paused':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'archived':
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
        }
    };

    const formatBillingInterval = (interval: string) => {
        const map: Record<string, string> = {
            'DAILY': 'day',
            'WEEKLY': 'week',
            'MONTHLY': 'month',
            'YEARLY': 'year',
        };
        return map[interval] || interval.toLowerCase();
    };

    const formatPricingModel = (model: string) => {
        const map: Record<string, string> = {
            'FLAT_RATE': 'Flat Rate',
            'PER_UNIT': 'Per Unit',
            'TIERED': 'Tiered',
            'VOLUME': 'Volume',
        };
        return map[model] || model;
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.PRODUCTS} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Products
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={cn("size-12 rounded-lg flex items-center justify-center border", product.status === 'active' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700')}>
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[24px]">{product.icon || 'inventory_2'}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                {product.productId || product.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreatePriceDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors min-h-[44px]"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create Price
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product Information</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getStatusStyle(product.status || ''))}>
                                            {product.status?.charAt(0).toUpperCase() + product.status?.slice(1) || '-'}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Product ID</dt>
                                    <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{product.productId || product.id}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{product.description || '-'}</dd>
                                </div>
                                {product.createdDate && (
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created</dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-white">{product.createdDate}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Prices</h2>
                            </div>
                            {prices.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No prices found</p>
                                    <button
                                        onClick={() => setIsCreatePriceDialogOpen(true)}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        Create Price
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interval</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Currency</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trial Days</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {prices.map((price: Price) => (
                                                <tr key={price.id}>
                                                    <td className="py-3 text-sm text-slate-900 dark:text-white">
                                                        {formatPricingModel(price.pricingModel)}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">
                                                        {formatBillingInterval(price.billingInterval)}
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                                                        {formatCurrency(price.unitAmount, price.currency)}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                                                        {price.currency}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                                                        {price.trialPeriodDays || '-'}
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={cn(
                                                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                            price.active
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                        )}>
                                                            {price.active ? 'Active' : 'Inactive'}
                                                        </span>
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
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    to={ROUTES.PRODUCTS}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Back to Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <CreatePriceDialog
                    isOpen={isCreatePriceDialogOpen}
                    onClose={() => setIsCreatePriceDialogOpen(false)}
                    onSuccess={() => {}}
                    productId={id || ''}
                />
            </div>
        </div>
    );
};

