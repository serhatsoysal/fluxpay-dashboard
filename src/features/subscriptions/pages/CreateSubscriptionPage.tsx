import { FC, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCreateSubscription, useSubscriptions } from '../api/subscriptionsQueries';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from '@/shared/components/ui/use-toast';
import { CreateSubscriptionInput } from '../types/subscription.types';

export const CreateSubscriptionPage: FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateSubscriptionInput & { priceId: string; customerId: string }>({
        customerId: '',
        priceId: '',
        quantity: 1,
        trialDays: undefined,
        metadata: {},
    });
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const createSubscriptionMutation = useCreateSubscription();

    const { data: subscriptionsData } = useSubscriptions({ page: 0, size: 1000 });
    const subscriptions = subscriptionsData?.content || [];

    const customers = useMemo(() => {
        const customerMap = new Map<string, { id: string; name: string; email: string }>();
        subscriptions.forEach((sub: any) => {
            const customerId = sub.customerId;
            if (!customerMap.has(customerId)) {
                const name = sub.customerName || 'Unknown Customer';
                const email = sub.customerEmail || `${customerId}@example.com`;
                customerMap.set(customerId, { id: customerId, name, email });
            }
        });
        return Array.from(customerMap.values());
    }, [subscriptions]);

    const { data: productsData } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { productsApi } = await import('@/features/products/api/productsApi');
            return productsApi.getAll();
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const { data: pricesData } = useQuery({
        queryKey: ['prices', formData.priceId.split('-')[0]],
        queryFn: async () => {
            if (!formData.priceId) return [];
            const productId = formData.priceId.split('-')[0];
            const { productsApi } = await import('@/features/products/api/productsApi');
            return productsApi.getPrices(productId);
        },
        enabled: !!formData.priceId,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {};
        
        if (!formData.customerId) {
            newErrors.customerId = 'Customer is required';
        }
        
        if (!formData.priceId) {
            newErrors.priceId = 'Price is required';
        }
        
        if (formData.quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        try {
            const priceId = formData.priceId.split('-')[1] || formData.priceId;
            await createSubscriptionMutation.mutateAsync({
                customerId: formData.customerId,
                priceId: priceId,
                quantity: formData.quantity,
                trialDays: formData.trialDays,
                metadata: formData.metadata,
            });
            toast({
                title: 'Success',
                description: 'Subscription created successfully',
            });
            navigate(ROUTES.SUBSCRIPTIONS);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create subscription',
            });
        }
    };

    const products = productsData || [];
    const prices = pricesData || [];

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-4xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.SUBSCRIPTIONS} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Subscriptions
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">Create Subscription</span>
                </div>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Create Subscription
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Create a new subscription for a customer
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Customer
                        </label>
                        <select
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                </option>
                            ))}
                        </select>
                        {errors.customerId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Product
                        </label>
                        <select
                            value={formData.priceId.split('-')[0] || ''}
                            onChange={(e) => {
                                const productId = e.target.value;
                                setFormData({ ...formData, priceId: productId ? `${productId}-` : '' });
                            }}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                        >
                            <option value="">Select a product</option>
                            {products.map((product: any) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.priceId.split('-')[0] && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Price
                            </label>
                            <select
                                value={formData.priceId}
                                onChange={(e) => setFormData({ ...formData, priceId: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                            >
                                <option value="">Select a price</option>
                                {prices.map((price: any) => (
                                    <option key={price.id} value={`${formData.priceId.split('-')[0]}-${price.id}`}>
                                        {price.unitAmount / 100} {price.currency} / {price.billingInterval?.toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.priceId && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priceId}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                        />
                        {errors.quantity && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Trial Period Days (optional)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.trialDays || ''}
                            onChange={(e) => setFormData({ ...formData, trialDays: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createSubscriptionMutation.isPending}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                            {createSubscriptionMutation.isPending ? 'Creating...' : 'Create Subscription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

