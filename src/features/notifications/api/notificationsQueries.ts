import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from './notificationsApi';
import { NotificationFilters, MarkAsReadInput } from '../types/notification.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';
export const UNREAD_COUNT_QUERY_KEY = 'notifications-unread-count';

export const useNotifications = (filters: NotificationFilters = {}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);
    
    return useQuery({
        queryKey: [NOTIFICATIONS_QUERY_KEY, filters],
        queryFn: () => notificationsApi.getAll(filters),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: true,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useUnreadCount = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);
    
    return useQuery({
        queryKey: [UNREAD_COUNT_QUERY_KEY],
        queryFn: () => notificationsApi.getUnreadCount(),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: true,
        refetchInterval: 60000,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: MarkAsReadInput) => notificationsApi.markAsRead(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
        },
    });
};

