import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './authApi';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: login,
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            logout();
            queryClient.clear();
        },
    });
};
