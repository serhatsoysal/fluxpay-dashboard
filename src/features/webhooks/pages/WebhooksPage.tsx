import { FC, useState } from 'react';
import { useWebhooks, useDeleteWebhook } from '../api/webhooksQueries';
import { CreateWebhookDialog } from '../components/CreateWebhookDialog';
import { EditWebhookDialog } from '../components/EditWebhookDialog';
import { ConfirmationDialog } from '@/shared/components/ui/ConfirmationDialog';
import { Webhook } from '../types/webhook.types';
import { formatDate } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/use-toast';

export const WebhooksPage: FC = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);

    const { data: webhooksData, isLoading } = useWebhooks();
    const webhooks = webhooksData || [];
    const deleteWebhookMutation = useDeleteWebhook();

    const handleDelete = async () => {
        if (!selectedWebhook) return;
        try {
            await deleteWebhookMutation.mutateAsync(selectedWebhook.id);
            toast({
                title: 'Success',
                description: 'Webhook deleted successfully',
            });
            setIsDeleteDialogOpen(false);
            setSelectedWebhook(null);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to delete webhook',
            });
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Webhooks
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Manage your webhook endpoints
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors min-h-[44px]"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create Webhook
                    </button>
                </header>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-slate-500 dark:text-slate-400">Loading webhooks...</div>
                        </div>
                    ) : webhooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-4">webhook</span>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">No webhooks found</p>
                            <button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Create Webhook
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">URL</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Events</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {webhooks.map((webhook: Webhook) => (
                                        <tr key={webhook.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="text-sm font-mono text-slate-900 dark:text-white max-w-md truncate">
                                                    {webhook.url}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {webhook.events.slice(0, 3).map((event: string) => (
                                                        <span
                                                            key={event}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                        >
                                                            {event}
                                                        </span>
                                                    ))}
                                                    {webhook.events.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            +{webhook.events.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className={cn(
                                                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                    webhook.active
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                )}>
                                                    {webhook.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-sm text-slate-600 dark:text-slate-300">
                                                {webhook.createdAt ? formatDate(webhook.createdAt) : '-'}
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedWebhook(webhook);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                                        title="Edit webhook"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedWebhook(webhook);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <CreateWebhookDialog
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSuccess={() => {}}
                />

                {selectedWebhook && (
                    <EditWebhookDialog
                        isOpen={isEditDialogOpen}
                        onClose={() => {
                            setIsEditDialogOpen(false);
                            setSelectedWebhook(null);
                        }}
                        onSuccess={() => {
                            setIsEditDialogOpen(false);
                            setSelectedWebhook(null);
                        }}
                        webhook={selectedWebhook}
                    />
                )}

                <ConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setSelectedWebhook(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Webhook"
                    description={`Are you sure you want to delete this webhook? This action cannot be undone.`}
                    confirmText="Delete Webhook"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    icon="warning"
                />
            </div>
        </div>
    );
};
