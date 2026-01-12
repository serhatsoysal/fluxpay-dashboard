import { FC, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications, useMarkAsRead } from '../api/notificationsQueries';
import { formatDate, formatRelativeTime } from '@/shared/utils/dateHelpers';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/use-toast';

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    type?: string;
}

export const NotificationsPage: FC = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const queryClient = useQueryClient();

    const { data, isLoading } = useNotifications({ page, size });
    const markAsReadMutation = useMarkAsRead();
    const markAllAsReadMutation = useMarkAsRead();

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsReadMutation.mutateAsync({ id });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to mark notification as read',
            });
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadMutation.mutateAsync({ all: true });
            toast({
                title: 'Success',
                description: 'All notifications marked as read',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to mark all as read',
            });
        }
    };

    const notifications: Notification[] = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Notifications
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Manage your notifications
                        </p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={markAllAsReadMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                            <span className="material-symbols-outlined text-[18px]">done_all</span>
                            Mark All as Read
                        </button>
                    )}
                </header>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-slate-500 dark:text-slate-400">Loading notifications...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-4">notifications_none</span>
                            <p className="text-slate-500 dark:text-slate-400">No notifications found</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',
                                            !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={cn(
                                                        'text-sm font-semibold',
                                                        !notification.read
                                                            ? 'text-slate-900 dark:text-white'
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    )}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="size-2 rounded-full bg-primary"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                                    {formatRelativeTime(notification.createdAt)}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    disabled={markAsReadMutation.isPending}
                                                    className="px-3 py-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50 min-h-[32px]"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page >= totalPages - 1}
                                            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

