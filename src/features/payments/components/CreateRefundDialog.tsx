import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreateRefund } from '../api/paymentsQueries';
import { CreateRefundInput, Payment } from '../types/payment.types';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { toast } from '@/shared/components/ui/use-toast';

interface CreateRefundDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    payment: Payment;
    maxRefundAmount: number;
}

export const CreateRefundDialog: FC<CreateRefundDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    payment,
    maxRefundAmount,
}) => {
    const [formData, setFormData] = useState<CreateRefundInput>({
        amount: maxRefundAmount,
        reason: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateRefundInput, string>>>({});
    const createRefundMutation = useCreateRefund();

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                amount: maxRefundAmount,
                reason: '',
            });
            setErrors({});
        }
    }, [isOpen, maxRefundAmount]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateRefundInput, string>> = {};
        
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        } else if (formData.amount > maxRefundAmount) {
            newErrors.amount = `Amount cannot exceed ${formatCurrency(maxRefundAmount, payment.currency || 'USD')}`;
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
            await createRefundMutation.mutateAsync({ id: payment.id, input: formData });
            toast({
                title: 'Success',
                description: 'Refund created successfully',
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create refund',
            });
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
                aria-label="Close dialog"
            ></button>

            <div className="relative w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-lg shadow-modal border border-slate-100 dark:border-slate-800 transform transition-all scale-100 opacity-100 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Refund</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-5">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Max Refundable Amount</div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                {formatCurrency(maxRefundAmount, payment.currency || 'USD')}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="refund-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Refund Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                                    {payment.currency || 'USD'}
                                </span>
                                <input
                                    id="refund-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={maxRefundAmount / 100}
                                    value={(formData.amount || 0) / 100}
                                    onChange={(e) => {
                                        const value = Number.parseFloat(e.target.value) * 100;
                                        setFormData({ ...formData, amount: Number.isNaN(value) ? 0 : value });
                                    }}
                                    className="w-full pl-16 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="refund-reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Reason (optional)
                            </label>
                            <textarea
                                id="refund-reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                placeholder="Enter refund reason..."
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
                            disabled={createRefundMutation.isPending}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                            {createRefundMutation.isPending ? 'Creating...' : 'Create Refund'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

