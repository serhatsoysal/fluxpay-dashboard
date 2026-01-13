import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from './paymentsApi';
import { PaymentFilters, CreateRefundInput } from '../types/payment.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const PAYMENTS_QUERY_KEY = 'payments';
export const PAYMENT_STATS_QUERY_KEY = 'payment-stats';

export const usePayments = (filters: PaymentFilters) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [PAYMENTS_QUERY_KEY, filters],
        queryFn: () => paymentsApi.getAll(filters),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const usePayment = (id: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [PAYMENTS_QUERY_KEY, id],
        queryFn: () => paymentsApi.getById(id),
        enabled: isAuthenticated && hasAccessToken() && !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const usePaymentStats = (filters?: { dateFrom?: string; dateTo?: string }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [PAYMENT_STATS_QUERY_KEY, filters],
        queryFn: () => paymentsApi.getStats(filters),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useCreateRefund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: CreateRefundInput }) => paymentsApi.createRefund(id, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY, variables.id] });
            queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [PAYMENT_STATS_QUERY_KEY] });
        },
    });
};

