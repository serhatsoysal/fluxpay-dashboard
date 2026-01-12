import { FC, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { useCreateSubscription, useSubscriptions } from '../api/subscriptionsQueries';
import { CreateSubscriptionInput } from '../types/subscription.types';
import { toast } from '@/shared/components/ui/use-toast';

interface CreateSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateSubscriptionDialog: FC<CreateSubscriptionDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
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
        enabled: isOpen,
    });

    const { data: pricesData } = useQuery({
        queryKey: ['prices', formData.priceId.split('-')[0]],
        queryFn: async () => {
            if (!formData.priceId) return [];
            const productId = formData.priceId.split('-')[0];
            const { productsApi } = await import('@/features/products/api/productsApi');
            return productsApi.getPrices(productId);
        },
        enabled: !!formData.priceId && isOpen,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                customerId: '',
                priceId: '',
                quantity: 1,
                trialDays: undefined,
                metadata: {},
            });
            setErrors({});
        }
    }, [isOpen]);

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
            onSuccess();
            handleClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create subscription',
            });
        }
    };

    const handleClose = () => {
        setFormData({
            customerId: '',
            priceId: '',
            quantity: 1,
            trialDays: undefined,
            metadata: {},
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const products = productsData || [];
    const prices = pricesData || [];

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={handleClose}
            ></div>

            <div className="relative w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-modal border border-slate-100 dark:border-slate-800 transform transition-all scale-100 opacity-100 flex flex-col overflow-hidden max-h-[90vh] z-[10001]">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="p-6 pt-8 sm:p-8 overflow-y-auto">
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]">add_box</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white tracking-tight">
                                Create New Subscription
                            </h3>
                            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Create a new subscription for a customer. Fill in the details below.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Customer
                            </span>
                            <select
                                value={formData.customerId}
                                onChange={(e) => {
                                    setFormData({ ...formData, customerId: e.target.value });
                                    if (errors.customerId) {
                                        setErrors({ ...errors, customerId: undefined });
                                    }
                                }}
                                className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-4 pr-10 appearance-none cursor-pointer text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            >
                                <option value="">Select a customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} ({customer.email})
                                    </option>
                                ))}
                            </select>
                            {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Product
                            </span>
                            <select
                                value={formData.priceId.split('-')[0] || ''}
                                onChange={(e) => {
                                    const productId = e.target.value;
                                    setFormData({ ...formData, priceId: productId ? `${productId}-` : '' });
                                }}
                                className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-4 pr-10 appearance-none cursor-pointer text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            >
                                <option value="">Select a product</option>
                                {products.map((product: any) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {formData.priceId.split('-')[0] && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                    Price
                                </span>
                                <select
                                    value={formData.priceId}
                                    onChange={(e) => {
                                        setFormData({ ...formData, priceId: e.target.value });
                                        if (errors.priceId) {
                                            setErrors({ ...errors, priceId: undefined });
                                        }
                                    }}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-4 pr-10 appearance-none cursor-pointer text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                >
                                    <option value="">Select a price</option>
                                    {prices.map((price: any) => (
                                        <option key={price.id} value={`${formData.priceId.split('-')[0]}-${price.id}`}>
                                            {price.unitAmount / 100} {price.currency} / {price.billingInterval?.toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                                {errors.priceId && <p className="text-xs text-red-500">{errors.priceId}</p>}
                            </label>
                        )}

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Quantity
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">numbers</span>
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        setFormData({ ...formData, quantity: value });
                                        if (errors.quantity) {
                                            setErrors({ ...errors, quantity: undefined });
                                        }
                                    }}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Trial Period Days (optional)
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.trialDays || ''}
                                    onChange={(e) => setFormData({ ...formData, trialDays: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    placeholder="0"
                                />
                            </div>
                        </label>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={createSubscriptionMutation.isPending}
                                className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createSubscriptionMutation.isPending}
                                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createSubscriptionMutation.isPending ? 'Creating...' : 'Create Subscription'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent"></div>
            </div>
        </div>,
        document.body
    );
};

