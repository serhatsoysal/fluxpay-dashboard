import { FC, useState, useRef, useEffect } from 'react';
import { useNotifications, useUnreadCount, useMarkAsRead } from '../api/notificationsQueries';
import { Notification } from '../types/notification.types';
import { cn } from '@/shared/utils/cn';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return 'check_circle';
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        case 'subscription':
            return 'subscriptions';
        case 'invoice':
            return 'receipt';
        case 'payment':
            return 'payment';
        default:
            return 'info';
    }
};

const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        case 'warning':
            return 'text-amber-600 bg-amber-50 border-amber-200';
        case 'error':
            return 'text-red-600 bg-red-50 border-red-200';
        case 'subscription':
            return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'invoice':
            return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'payment':
            return 'text-green-600 bg-green-50 border-green-200';
        default:
            return 'text-slate-600 bg-slate-50 border-slate-200';
    }
};

export const NotificationDropdown: FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
    
    const { data: notificationsData, isLoading } = useNotifications({
        page: 0,
        size: 20,
        status: selectedFilter === 'unread' ? 'unread' : undefined,
    });
    
    const { data: unreadCount } = useUnreadCount();
    const markAsReadMutation = useMarkAsRead();

    const notifications = notificationsData?.content || [];
    const hasUnread = (unreadCount || 0) > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleMarkAsRead = (notification: Notification) => {
        if (notification.status === 'unread') {
            markAsReadMutation.mutate({ id: notification.id });
        }
    };

    const handleMarkAllAsRead = () => {
        markAsReadMutation.mutate({ all: true });
    };

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Unknown time';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-slate-200 bg-white shadow-lg z-50"
        >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                {hasUnread && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setSelectedFilter('all')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                        selectedFilter === 'all'
                            ? "text-primary border-b-2 border-primary bg-slate-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                >
                    All
                </button>
                <button
                    onClick={() => setSelectedFilter('unread')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors relative",
                        selectedFilter === 'unread'
                            ? "text-primary border-b-2 border-primary bg-slate-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                >
                    Unread
                    {hasUnread && (
                        <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] font-semibold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-slate-500">Loading notifications...</div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                        <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">notifications_none</span>
                        <p className="text-sm text-slate-500">No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => {
                            const isUnread = notification.status === 'unread';
                            const icon = getNotificationIcon(notification.type);
                            const colorClasses = getNotificationColor(notification.type);

                            return (
                                <div
                                    key={notification.id}
                                    onClick={() => handleMarkAsRead(notification)}
                                    className={cn(
                                        "flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer",
                                        isUnread && "bg-blue-50/50"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0 h-10 w-10 rounded-full border flex items-center justify-center",
                                        colorClasses
                                    )}>
                                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className={cn(
                                                "text-sm font-medium text-slate-900 line-clamp-1",
                                                isUnread && "font-semibold"
                                            )}>
                                                {notification.title}
                                            </p>
                                            {isUnread && (
                                                <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {formatTime(notification.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="border-t border-slate-200 px-4 py-2 text-center">
                    <button className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

