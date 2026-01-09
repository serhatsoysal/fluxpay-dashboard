import { apiClient } from '@/shared/api/apiClient';
import { API_ROUTES } from '@/shared/constants/apiEndpoints';
import { LoginCredentials, RegisterCredentials, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, Session } from '../types/auth.types';

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<any> => {
        const response = await apiClient.post(API_ROUTES.TENANTS.REGISTER, credentials);
        return response.data;
    },

    refreshToken: async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post(API_ROUTES.AUTH.REFRESH, request);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    },

    logoutAll: async (): Promise<void> => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT_ALL);
    },

    getSessions: async (): Promise<Session[]> => {
        const response = await apiClient.get(API_ROUTES.AUTH.SESSIONS);
        return response.data;
    },
};
