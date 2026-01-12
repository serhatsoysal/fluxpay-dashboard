import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from './subscriptionsApi';
import { SubscriptionFilters } from '../types/subscription.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useSubscriptions = (filters: SubscriptionFilters) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);
    
    return useQuery({
        queryKey: ['subscriptions', filters],
        queryFn: () => subscriptionsApi.getAll(filters),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useSubscription = (id: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);
    
    return useQuery({
        queryKey: ['subscriptions', id],
        queryFn: () => subscriptionsApi.getById(id),
        enabled: isAuthenticated && hasAccessToken() && !!id,
    });
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: subscriptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
            subscriptionsApi.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['subscriptions', id] });
            const previous = queryClient.getQueryData(['subscriptions', id]);
            queryClient.setQueryData(['subscriptions', id], data);
            return { previous };
        },
        onError: (_err, { id }, context) => {
            queryClient.setQueryData(['subscriptions', id], context?.previous);
        },
        onSettled: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['subscriptions', data.id] });
            }
        },
    });
};

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, immediately = false, reason }: { id: string; immediately?: boolean; reason?: string }) =>
            subscriptionsApi.cancel(id, immediately, reason),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions', data.id] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};

export const usePauseSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subscriptionsApi.pause(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions', data.id] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};

export const useResumeSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subscriptionsApi.resume(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions', data.id] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};