import { FC, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useInvoice, useFinalizeInvoice, useVoidInvoice } from '../api/invoicesQueries';
import { invoicesApi } from '../api/invoicesApi';
import { ConfirmationDialog } from '@/shared/components/ui/ConfirmationDialog';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/use-toast';

export const InvoiceDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: invoice, isLoading, error } = useInvoice(id || '');
    const { data: items = [] } = useQuery({
        queryKey: ['invoices', id, 'items'],
        queryFn: () => invoicesApi.getItems(id || ''),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
    const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);

    const finalizeMutation = useFinalizeInvoice();
    const voidMutation = useVoidInvoice();

    const handleFinalize = async () => {
        if (!id) return;
        try {
            await finalizeMutation.mutateAsync(id);
            toast({
                title: 'Success',
                description: 'Invoice finalized successfully',
            });
            setIsFinalizeDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to finalize invoice',
            });
        }
    };

    const handleVoid = async () => {
        if (!id) return;
        try {
            await voidMutation.mutateAsync(id);
            toast({
                title: 'Success',
                description: 'Invoice voided successfully',
            });
            setIsVoidDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to void invoice',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-slate-500 dark:text-slate-400">Loading invoice...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load invoice</p>
                        <Link
                            to={ROUTES.INVOICES}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Back to Invoices
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const status = invoice.status?.toUpperCase() || '';
    const canFinalize = status === 'DRAFT';
    const canVoid = status !== 'VOID' && status !== 'PAID';

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

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.INVOICES} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Invoices
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{invoice.invoiceNumber}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {invoice.invoiceNumber}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {invoice.customerName || invoice.customerEmail || 'Customer'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {canFinalize && (
                            <button
                                onClick={() => setIsFinalizeDialogOpen(true)}
                                disabled={finalizeMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Finalize
                            </button>
                        )}
                        {canVoid && (
                            <button
                                onClick={() => setIsVoidDialogOpen(true)}
                                disabled={voidMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Void
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Invoice Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getInvoiceStatusStyle(invoice.status || ''))}>
                                            <span className={cn('size-1.5 rounded-full mr-1.5', getInvoiceStatusDot(invoice.status || ''))}></span>
                                            {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1).replace('_', ' ') || '-'}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Invoice Number</dt>
                                    <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{invoice.invoiceNumber || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Invoice Date</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : invoice.createdAt ? formatDate(invoice.createdAt) : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Due Date</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{invoice.customerName || invoice.customerEmail || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Currency</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{invoice.currency || 'USD'}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Invoice Items</h2>
                            {items.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No items found</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Quantity</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Unit Amount</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {items.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="py-3 text-sm text-slate-900 dark:text-white">
                                                        {item.description || '-'}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300 text-right">
                                                        {item.quantity || 1}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300 text-right">
                                                        {formatCurrency(item.unitAmount || 0, invoice.currency || 'USD')}
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                                                        {formatCurrency(item.amount || 0, invoice.currency || 'USD')}
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
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Summary</h2>
                            <dl className="space-y-4">
                                <div className="flex justify-between">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Subtotal</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(invoice.subtotal || 0, invoice.currency || 'USD')}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Tax</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(invoice.tax || 0, invoice.currency || 'USD')}
                                    </dd>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between">
                                    <dt className="text-base font-semibold text-slate-900 dark:text-white">Total</dt>
                                    <dd className="text-base font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(invoice.total || 0, invoice.currency || 'USD')}
                                    </dd>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount Paid</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(invoice.amountPaid || 0, invoice.currency || 'USD')}
                                    </dd>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount Due</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(invoice.amountDue || 0, invoice.currency || 'USD')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <ConfirmationDialog
                    isOpen={isFinalizeDialogOpen}
                    onClose={() => setIsFinalizeDialogOpen(false)}
                    onConfirm={handleFinalize}
                    title="Finalize Invoice"
                    description="Are you sure you want to finalize this invoice? Once finalized, the invoice status will change to OPEN and cannot be edited."
                    confirmText="Finalize Invoice"
                    cancelText="Cancel"
                    icon="check_circle"
                />

                <ConfirmationDialog
                    isOpen={isVoidDialogOpen}
                    onClose={() => setIsVoidDialogOpen(false)}
                    onConfirm={handleVoid}
                    title="Void Invoice"
                    description="Are you sure you want to void this invoice? This action cannot be undone."
                    confirmText="Void Invoice"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    icon="warning"
                />
            </div>
        </div>
    );
};

