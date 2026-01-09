import { FC, useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface Webhook {
    id: string;
    url: string;
    events: string[];
    status: 'active' | 'inactive' | 'failed';
    lastTriggered: string;
    secret: string;
}

export const WebhooksPage: FC = () => {
    const [webhooks] = useState<Webhook[]>([
        {
            id: '1',
            url: 'https://api.example.com/webhooks/payments',
            events: ['payment.succeeded', 'payment.failed', 'subscription.created'],
            status: 'active',
            lastTriggered: 'Oct 24, 2023 14:32:15',
            secret: 'whsec_*****abc123',
        },
        {
            id: '2',
            url: 'https://app.example.com/webhook',
            events: ['subscription.canceled'],
            status: 'active',
            lastTriggered: 'Oct 23, 2023 09:15:42',
            secret: 'whsec_*****def456',
        },
        {
            id: '3',
            url: 'https://old-api.example.com/webhooks',
            events: ['invoice.paid'],
            status: 'inactive',
            lastTriggered: 'Oct 10, 2023 16:20:10',
            secret: 'whsec_*****ghi789',
        },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'inactive':
                return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'inactive': return 'bg-slate-400';
            case 'failed': return 'bg-red-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span>Dashboard</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">Webhooks</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Webhooks</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Configure webhook endpoints to receive real-time notifications for events in your account.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all min-w-[160px]">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            Add Webhook
                        </button>
                    </div>
            </header>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                    <th className="px-6 py-4">Endpoint URL</th>
                                    <th className="px-6 py-4">Events</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Triggered</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                {webhooks.map((webhook) => (
                                    <tr key={webhook.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">{webhook.url}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{webhook.secret}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {webhook.events.map((event, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {event}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusStyle(webhook.status))}>
                                                <span className={cn("size-1.5 rounded-full", getStatusDot(webhook.status))}></span>
                                                {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {webhook.lastTriggered}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-900 dark:text-white">1-{webhooks.length}</span> of <span className="font-medium text-slate-900 dark:text-white">3</span> webhooks
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg cursor-not-allowed bg-slate-50 dark:bg-slate-800">Previous</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 transition-colors">Next</button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <span className="material-symbols-outlined text-[24px]">info</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Webhook Security</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                All webhook requests include a signature header that you can use to verify the request is from FluxPay. 
                                Use your webhook secret to verify signatures and ensure request authenticity.
                            </p>
                            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                <code className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                                    X-FluxPay-Signature: t=1698164325,v1=abc123def456...
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

