import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, CreateProductInput, UpdateProductInput, CreatePriceInput } from './productsApi';

export const PRODUCTS_QUERY_KEY = 'products';
export const PRICES_QUERY_KEY = 'prices';

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

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: [PRODUCTS_QUERY_KEY, id],
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
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

export const useProductPrices = (productId: string) => {
    return useQuery({
        queryKey: [PRICES_QUERY_KEY, productId],
        queryFn: () => productsApi.getPrices(productId),
        enabled: !!productId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        gcTime: 300000,
    });
};

export const useCreatePrice = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ productId, input }: { productId: string; input: CreatePriceInput }) =>
            productsApi.createPrice(productId, input),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [PRICES_QUERY_KEY, variables.productId] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
        },
    });
};
