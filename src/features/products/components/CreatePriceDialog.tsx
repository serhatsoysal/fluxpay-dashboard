import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreatePrice } from '../api/productsQueries';
import { CreatePriceInput, PricingModel, BillingInterval } from '../types/product.types';
import { toast } from '@/shared/components/ui/use-toast';

interface CreatePriceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productId: string;
}

export const CreatePriceDialog: FC<CreatePriceDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    productId,
}) => {
    const [formData, setFormData] = useState<CreatePriceInput>({
        pricingModel: 'FLAT_RATE',
        billingInterval: 'MONTHLY',
        unitAmount: 0,
        currency: 'USD',
        trialPeriodDays: undefined,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreatePriceInput, string>>>({});
    const createPriceMutation = useCreatePrice();

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                pricingModel: 'FLAT_RATE',
                billingInterval: 'MONTHLY',
                unitAmount: 0,
                currency: 'USD',
                trialPeriodDays: undefined,
            });
            setErrors({});
        }
    }, [isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreatePriceInput, string>> = {};
        
        if (!formData.unitAmount || formData.unitAmount <= 0) {
            newErrors.unitAmount = 'Unit amount must be greater than 0';
        }
        
        if (!formData.currency) {
            newErrors.currency = 'Currency is required';
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
            await createPriceMutation.mutateAsync({
                productId,
                input: {
                    ...formData,
                    unitAmount: Math.round(formData.unitAmount * 100),
                },
            });
            toast({
                title: 'Success',
                description: 'Price created successfully',
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create price',
            });
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-modal border border-slate-100 dark:border-slate-800 transform transition-all scale-100 opacity-100 flex flex-col overflow-hidden max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Price</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Pricing Model
                            </label>
                            <select
                                value={formData.pricingModel}
                                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="FLAT_RATE">Flat Rate</option>
                                <option value="PER_UNIT">Per Unit</option>
                                <option value="TIERED">Tiered</option>
                                <option value="VOLUME">Volume</option>
                            </select>
                            {errors.pricingModel && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pricingModel}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Billing Interval
                            </label>
                            <select
                                value={formData.billingInterval}
                                onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value as BillingInterval })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                            {errors.billingInterval && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.billingInterval}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Unit Amount (in dollars)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.unitAmount || ''}
                                    onChange={(e) => setFormData({ ...formData, unitAmount: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-8 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.unitAmount && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.unitAmount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Currency
                            </label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                            {errors.currency && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currency}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Trial Period Days (optional)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.trialPeriodDays || ''}
                                onChange={(e) => setFormData({ ...formData, trialPeriodDays: e.target.value ? parseInt(e.target.value) : undefined })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createPriceMutation.isPending}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                            {createPriceMutation.isPending ? 'Creating...' : 'Create Price'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

