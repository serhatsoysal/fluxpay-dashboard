import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from './invoicesApi';
import { InvoiceFilters, CreateInvoiceInput } from '../types/invoice.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const INVOICES_QUERY_KEY = 'invoices';
export const INVOICE_STATS_QUERY_KEY = 'invoice-stats';

export const useInvoices = (filters: InvoiceFilters) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [INVOICES_QUERY_KEY, filters],
        queryFn: () => invoicesApi.getAll(filters),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useInvoiceStats = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [INVOICE_STATS_QUERY_KEY],
        queryFn: () => invoicesApi.getStats(),
        enabled: isAuthenticated && hasAccessToken(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useInvoice = (id: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [INVOICES_QUERY_KEY, id],
        queryFn: () => invoicesApi.getById(id),
        enabled: isAuthenticated && hasAccessToken() && !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useInvoiceItems = (id: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [INVOICES_QUERY_KEY, id, 'items'],
        queryFn: () => invoicesApi.getItems(id),
        enabled: isAuthenticated && hasAccessToken() && !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useCustomerInvoices = (customerId: string) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasAccessToken = useAuthStore((state) => state.hasAccessToken);

    return useQuery({
        queryKey: [INVOICES_QUERY_KEY, 'customer', customerId],
        queryFn: () => invoicesApi.getByCustomer(customerId),
        enabled: isAuthenticated && hasAccessToken() && !!customerId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useFinalizeInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => invoicesApi.finalize(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY, data.id] });
            queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
        },
    });
};

export const useVoidInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => invoicesApi.void(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY, data.id] });
            queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
        },
    });
};

export const useCreateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateInvoiceInput) => invoicesApi.create(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVOICE_STATS_QUERY_KEY] });
        },
    });
};
