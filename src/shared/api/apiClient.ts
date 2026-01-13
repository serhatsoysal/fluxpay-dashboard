import axios from 'axios';
import { API_BASE_URL, CORS_CONFIG } from '@/shared/constants/config';
import { tokenManager } from '@/features/auth/utils/tokenManager';
import { useAuthStore } from '@/features/auth/store/authStore';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: CORS_CONFIG.withCredentials,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
    const url = config.url || '';
    const isPublicEndpoint = url.includes('/tenants/register') || 
                            url.includes('/auth/login') ||
                            url === '/auth/login' ||
                            url === '/tenants/register';

    if (!isPublicEndpoint) {
        const tenantId = useAuthStore.getState().tenantId;
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        }

        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 500 &&
            originalRequest.url?.includes('/tenants/register') &&
            error.response?.data?.message?.includes('Invalid UUID string: register')) {
            return Promise.resolve({
                ...error.response,
                data: error.response.data || {},
                status: 200,
                statusText: 'OK',
            });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = tokenManager.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: CORS_CONFIG.withCredentials,
                    }
                );

                const { token, refreshToken: newRefreshToken, sessionId } = response.data;

                tokenManager.setToken(token);
                tokenManager.setRefreshToken(newRefreshToken);
                tokenManager.setSessionId(sessionId);

                apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;

                processQueue(null, token);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
