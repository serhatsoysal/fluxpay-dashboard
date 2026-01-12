import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSubscriptions } from '@/features/subscriptions/api/subscriptionsQueries';
import { toast } from '@/shared/components/ui/use-toast';

interface CreateInvoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateInvoiceDialog: FC<CreateInvoiceDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        customerId: '',
        amount: '',
        currency: 'USD',
        description: '',
        dueDate: '',
    });
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const { data: subscriptionsData } = useSubscriptions({ page: 0, size: 1000 });
    const subscriptions = subscriptionsData?.content || [];

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                customerId: '',
                amount: '',
                currency: 'USD',
                description: '',
                dueDate: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    const customers = Array.from(new Set(subscriptions.map((sub: any) => ({
        id: sub.customerId,
        name: sub.customerName || 'Unknown Customer',
        email: sub.customerEmail || `${sub.customerId}@example.com`,
    }))));

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {};
        
        if (!formData.customerId) {
            newErrors.customerId = 'Customer is required';
        }
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
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
            toast({
                title: 'Coming Soon',
                description: 'Invoice creation will be available in a future update.',
            });
            handleClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create invoice',
            });
        }
    };

    const handleClose = () => {
        setFormData({
            customerId: '',
            amount: '',
            currency: 'USD',
            description: '',
            dueDate: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

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
                            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white tracking-tight">
                                Create New Invoice
                            </h3>
                            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Create a new invoice for a customer. Fill in the details below.
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

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                    Amount
                                </span>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">attach_money</span>
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => {
                                            setFormData({ ...formData, amount: e.target.value });
                                            if (errors.amount) {
                                                setErrors({ ...errors, amount: undefined });
                                            }
                                        }}
                                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                    Currency
                                </span>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-4 pr-10 appearance-none cursor-pointer text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Description
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">description</span>
                                </span>
                                <textarea
                                    placeholder="Invoice description"
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (errors.description) {
                                            setErrors({ ...errors, description: undefined });
                                        }
                                    }}
                                    rows={3}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 pl-10 pr-4 py-2.5 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Due Date (optional)
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                </span>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </label>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                            >
                                Create Invoice
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

