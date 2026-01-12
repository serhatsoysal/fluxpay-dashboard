import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webhooksApi } from './webhooksApi';
import { CreateWebhookInput } from '../types/webhook.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const WEBHOOKS_QUERY_KEY = 'webhooks';

export const useWebhooks = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [WEBHOOKS_QUERY_KEY],
        queryFn: () => webhooksApi.getAll(),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useWebhook = (id: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [WEBHOOKS_QUERY_KEY, id],
        queryFn: () => webhooksApi.getById(id),
        enabled: isAuthenticated && hasAccessToken() && !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateWebhookInput) => webhooksApi.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WEBHOOKS_QUERY_KEY] });
        },
    });
};

export const useDeleteWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => webhooksApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WEBHOOKS_QUERY_KEY] });
        },
    });
};

