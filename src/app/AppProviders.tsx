import { FC, ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { Toaster } from '@/shared/components/ui/toaster';
import { useAuthStore } from '@/features/auth/store/authStore';

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize().catch(() => {});
    }, [initialize]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
        </QueryClientProvider>
    );
};
