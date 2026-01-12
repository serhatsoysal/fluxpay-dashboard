import { FC, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSubscription, useCancelSubscription, usePauseSubscription, useResumeSubscription } from '../api/subscriptionsQueries';
import { subscriptionsApi } from '../api/subscriptionsApi';
import { ConfirmationDialog } from '@/shared/components/ui/ConfirmationDialog';
import { ROUTES } from '@/shared/constants/routes';
import {
    formatSubscriptionStatus,
    getStatusColor,
    getStatusDotColor,
    formatCurrency,
    getCustomerInitials,
} from '../utils/subscriptionHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/use-toast';

export const SubscriptionDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: subscription, isLoading, error } = useSubscription(id || '');
    const { data: items = [] } = useQuery({
        queryKey: ['subscriptions', id, 'items'],
        queryFn: () => subscriptionsApi.getItems(id || ''),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
    
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
    const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
    const [cancelImmediately, setCancelImmediately] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const cancelMutation = useCancelSubscription();
    const pauseMutation = usePauseSubscription();
    const resumeMutation = useResumeSubscription();

    const handleCancel = async () => {
        if (!id) return;
        try {
            await cancelMutation.mutateAsync({ id, immediately: cancelImmediately, reason: cancelReason || undefined });
            toast({
                title: 'Success',
                description: 'Subscription canceled successfully',
            });
            setIsCancelDialogOpen(false);
            navigate(ROUTES.SUBSCRIPTIONS);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to cancel subscription',
            });
        }
    };

    const handlePause = async () => {
        if (!id) return;
        try {
            await pauseMutation.mutateAsync(id);
            toast({
                title: 'Success',
                description: 'Subscription paused successfully',
            });
            setIsPauseDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to pause subscription',
            });
        }
    };

    const handleResume = async () => {
        if (!id) return;
        try {
            await resumeMutation.mutateAsync(id);
            toast({
                title: 'Success',
                description: 'Subscription resumed successfully',
            });
            setIsResumeDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to resume subscription',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-slate-500 dark:text-slate-400">Loading subscription...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !subscription) {
        return (
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Failed to load subscription</p>
                        <Link
                            to={ROUTES.SUBSCRIPTIONS}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Back to Subscriptions
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const status = subscription.status?.toUpperCase() || '';
    const canPause = status === 'ACTIVE' || status === 'TRIALING';
    const canResume = status === 'PAUSED';
    const canCancel = status !== 'CANCELED' && status !== 'INCOMPLETE_EXPIRED';

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to={ROUTES.SUBSCRIPTIONS} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Subscriptions
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{subscription.id}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            {getCustomerInitials(subscription.customerName || 'Unknown')}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {subscription.productName || 'Subscription'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                {subscription.customerName || 'Unknown Customer'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {canResume && (
                            <button
                                onClick={() => setIsResumeDialogOpen(true)}
                                disabled={resumeMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                Resume
                            </button>
                        )}
                        {canPause && (
                            <button
                                onClick={() => setIsPauseDialogOpen(true)}
                                disabled={pauseMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">pause</span>
                                Pause
                            </button>
                        )}
                        {canCancel && (
                            <button
                                onClick={() => setIsCancelDialogOpen(true)}
                                disabled={cancelMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Subscription Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(subscription.status || ''))}>
                                            <div className={cn('size-1.5 rounded-full mr-1.5', getStatusDotColor(subscription.status || ''))}></div>
                                            {formatSubscriptionStatus(subscription.status || '')}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount</dt>
                                    <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(subscription.amount || 0, subscription.currency || 'USD')}
                                        {subscription.interval && ` / ${subscription.interval}`}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Period Start</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {subscription.currentPeriodStart ? formatDate(subscription.currentPeriodStart) : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Period End</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Quantity</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{subscription.quantity || 1}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Cancel at Period End</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {subscription.cancelAtPeriodEnd ? 'Yes' : 'No'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Subscription Items</h2>
                            {items.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No items found</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price ID</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                                                <th className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Usage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {items.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="py-3 text-sm text-slate-900 dark:text-white font-mono">
                                                        {item.priceId || '-'}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300">
                                                        {item.quantity || 1}
                                                    </td>
                                                    <td className="py-3 text-sm text-slate-600 dark:text-slate-300 text-right">
                                                        {item.usageQuantity || 0}
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
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer Information</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer Name</dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{subscription.customerName || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Customer ID</dt>
                                    <dd className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{subscription.customerId || '-'}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <ConfirmationDialog
                    isOpen={isCancelDialogOpen}
                    onClose={() => setIsCancelDialogOpen(false)}
                    onConfirm={handleCancel}
                    title="Cancel Subscription"
                    description={
                        <div className="space-y-4">
                            <p>Are you sure you want to cancel this subscription?</p>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={cancelImmediately}
                                        onChange={(e) => setCancelImmediately(e.target.checked)}
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Cancel immediately</span>
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Reason (optional)
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Enter cancellation reason..."
                                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    confirmText="Cancel Subscription"
                    cancelText="Keep Subscription"
                    confirmVariant="danger"
                    icon="warning"
                />

                <ConfirmationDialog
                    isOpen={isPauseDialogOpen}
                    onClose={() => setIsPauseDialogOpen(false)}
                    onConfirm={handlePause}
                    title="Pause Subscription"
                    description="Are you sure you want to pause this subscription? The subscription will stop billing until resumed."
                    confirmText="Pause Subscription"
                    cancelText="Cancel"
                    icon="pause"
                />

                <ConfirmationDialog
                    isOpen={isResumeDialogOpen}
                    onClose={() => setIsResumeDialogOpen(false)}
                    onConfirm={handleResume}
                    title="Resume Subscription"
                    description="Are you sure you want to resume this subscription? Billing will resume immediately."
                    confirmText="Resume Subscription"
                    cancelText="Cancel"
                    icon="play_arrow"
                />
            </div>
        </div>
    );
};

