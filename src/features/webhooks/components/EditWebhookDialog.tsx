import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUpdateWebhook } from '../api/webhooksQueries';
import { UpdateWebhookInput, Webhook } from '../types/webhook.types';
import { toast } from '@/shared/components/ui/use-toast';

interface EditWebhookDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    webhook: Webhook;
}

const WEBHOOK_EVENTS = [
    'invoice.created',
    'invoice.paid',
    'invoice.voided',
    'subscription.created',
    'subscription.updated',
    'subscription.canceled',
    'subscription.paused',
    'subscription.resumed',
    'payment.succeeded',
    'payment.failed',
];

export const EditWebhookDialog: FC<EditWebhookDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    webhook,
}) => {
    const [formData, setFormData] = useState<UpdateWebhookInput>({
        url: webhook.url,
        events: webhook.events || [],
        active: webhook.active,
        secret: webhook.secret || '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof UpdateWebhookInput, string>>>({});
    const updateWebhookMutation = useUpdateWebhook();

    useEffect(() => {
        if (isOpen && webhook) {
            setFormData({
                url: webhook.url,
                events: webhook.events || [],
                active: webhook.active,
                secret: webhook.secret || '',
            });
            setErrors({});
        }
    }, [isOpen, webhook]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof UpdateWebhookInput, string>> = {};
        
        if (!formData.url?.trim()) {
            newErrors.url = 'URL is required';
        } else if (formData.url && !formData.url.startsWith('https://')) {
            newErrors.url = 'URL must start with https://';
        }
        
        if (formData.events && formData.events.length === 0) {
            newErrors.events = 'At least one event must be selected';
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
            await updateWebhookMutation.mutateAsync({ id: webhook.id, input: formData });
            toast({
                title: 'Success',
                description: 'Webhook updated successfully',
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to update webhook',
            });
        }
    };

    const toggleEvent = (event: string) => {
        const currentEvents = formData.events || [];
        setFormData({
            ...formData,
            events: currentEvents.includes(event)
                ? currentEvents.filter(e => e !== event)
                : [...currentEvents, event],
        });
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Webhook</h2>
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
                                Webhook URL
                            </label>
                            <input
                                type="url"
                                value={formData.url || ''}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                                placeholder="https://example.com/webhook"
                            />
                            {errors.url && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Enabled Events
                            </label>
                            <div className="border border-slate-300 dark:border-slate-600 rounded-lg p-3 max-h-48 overflow-y-auto">
                                <div className="space-y-2">
                                    {WEBHOOK_EVENTS.map((event) => (
                                        <label key={event} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={(formData.events || []).includes(event)}
                                                onChange={() => toggleEvent(event)}
                                                className="rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-slate-900 dark:text-white">{event}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {errors.events && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.events}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Secret (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.secret || ''}
                                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                                placeholder="webhook-secret-key"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active ?? true}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                Active
                            </label>
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
                            disabled={updateWebhookMutation.isPending}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                            {updateWebhookMutation.isPending ? 'Updating...' : 'Update Webhook'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

