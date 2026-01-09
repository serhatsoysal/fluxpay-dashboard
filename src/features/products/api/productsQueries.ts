import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, CreateProductInput, UpdateProductInput } from './productsApi';

export const PRODUCTS_QUERY_KEY = 'products';

export const useProducts = () => {
    return useQuery({
        queryKey: [PRODUCTS_QUERY_KEY],
        queryFn: () => productsApi.getAll(),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (input: CreateProductInput) => productsApi.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) => 
            productsApi.update(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => productsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
        },
    });
};
