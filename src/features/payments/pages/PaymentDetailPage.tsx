import { FC, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePayment } from '../api/paymentsQueries';
import { CreateRefundDialog } from '../components/CreateRefundDialog';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from '@/features/subscriptions/utils/subscriptionHelpers';
import { formatDateTime } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';

export const PaymentDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: payment, isLoading, error } = usePayment(id || '');
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

    const getPaymentStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'REFUNDED':
            case 'PARTIALLY_REFUNDED':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'CANCELED':
                return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-600';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
        }
    };

    const getPaymentStatusDot = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'bg-emerald-500';
            case 'PROCESSING': return 'bg-blue-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'FAILED': return 'bg-red-500';
            case 'REFUNDED':
            case 'PARTIALLY_REFUNDED': return 'bg-purple-500';
            case 'CANCELED': return 'bg-slate-500';
            default: return 'bg-slate-400';
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-slate-500 dark:text-slate-400">Loading payment...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load payment</p>
                        <Link
                            to={ROUTES.PAYMENTS}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Back to Payments
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const canRefund = payment.status === 'COMPLETED' && (payment.amount - (payment.refundedAmount || 0)) > 0;
    const refundableAmount = payment.amount - (payment.refundedAmount || 0);
    const customerName = payment.customerName || payment.customerEmail || 'Unknown';

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.PAYMENTS} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Payments
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{payment.transactionId || payment.id.substring(0, 8)}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Payment {payment.transactionId || payment.id.substring(0, 8)}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {customerName}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {canRefund && (
                            <button
                                onClick={() => setIsRefundDialogOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">undo</span>
                                {' '}Refund
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getPaymentStatusStyle(payment.status || ''))}>
                                            <span className={cn('size-1.5 rounded-full mr-1.5', getPaymentStatusDot(payment.status || ''))}></span>
                                            {payment.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || '-'}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Transaction ID</dt>
                                    <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{payment.transactionId || payment.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount</dt>
                                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(payment.amount || 0, payment.currency || 'USD')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Currency</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{payment.currency || 'USD'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Payment Method</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {payment.paymentMethod?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || '-'}
                                    </dd>
                                </div>
                                {payment.paymentIntentId && (
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Payment Intent ID</dt>
                                        <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{payment.paymentIntentId}</dd>
                                    </div>
                                )}
                                {payment.refundedAmount > 0 && (
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Refunded Amount</dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                            {formatCurrency(payment.refundedAmount || 0, payment.currency || 'USD')}
                                        </dd>
                                    </div>
                                )}
                                {payment.paidAt && (
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Paid At</dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-white">{formatDateTime(payment.paidAt)}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created At</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{formatDateTime(payment.createdAt)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Updated At</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{formatDateTime(payment.updatedAt)}</dd>
                                </div>
                            </dl>
                            {payment.failureReason && (
                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <dt className="text-sm font-medium text-red-800 dark:text-red-300">Failure Reason</dt>
                                    <dd className="mt-1 text-sm text-red-700 dark:text-red-400">{payment.failureReason}</dd>
                                </div>
                            )}
                        </div>

                        {payment.invoiceId && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Related Invoice</h2>
                                <Link
                                    to={ROUTES.INVOICE_DETAIL.replace(':id', payment.invoiceId)}
                                    className="text-primary hover:text-primary-dark font-medium text-sm"
                                >
                                    View Invoice →
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer</h2>
                            <div className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{payment.customerName || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{payment.customerEmail || '-'}</dd>
                                </div>
                                {payment.customerId && (
                                    <Link
                                        to={ROUTES.CUSTOMER_DETAIL.replace(':id', payment.customerId)}
                                        className="inline-block mt-2 text-primary hover:text-primary-dark font-medium text-sm"
                                    >
                                        View Customer →
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Summary</h2>
                            <dl className="space-y-3">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-slate-500 dark:text-slate-400">Amount</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(payment.amount || 0, payment.currency || 'USD')}
                                    </dd>
                                </div>
                                {payment.refundedAmount > 0 && (
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-slate-500 dark:text-slate-400">Refunded</dt>
                                        <dd className="text-sm text-slate-900 dark:text-white">
                                            {formatCurrency(payment.refundedAmount || 0, payment.currency || 'USD')}
                                        </dd>
                                    </div>
                                )}
                                {canRefund && (
                                    <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Refundable</dt>
                                        <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(refundableAmount, payment.currency || 'USD')}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <CreateRefundDialog
                isOpen={isRefundDialogOpen}
                onClose={() => setIsRefundDialogOpen(false)}
                onSuccess={() => {
                    setIsRefundDialogOpen(false);
                }}
                payment={payment}
                maxRefundAmount={refundableAmount}
            />
        </div>
    );
};

