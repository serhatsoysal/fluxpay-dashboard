import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from './authStore';
import { tokenManager } from '../utils/tokenManager';
import { authApi } from '../api/authApi';
import { crossTabSync } from '../utils/crossTabSync';

vi.mock('../utils/tokenManager', () => ({
    tokenManager: {
        getToken: vi.fn(),
        setToken: vi.fn(),
        getRefreshToken: vi.fn(),
        setRefreshToken: vi.fn(),
        getSessionId: vi.fn(),
        setSessionId: vi.fn(),
        getUserId: vi.fn(),
        setUserId: vi.fn(),
        getRole: vi.fn(),
        setRole: vi.fn(),
        clearToken: vi.fn(),
    },
}));

vi.mock('../api/authApi', () => ({
    authApi: {
        login: vi.fn(),
        register: vi.fn(),
        refreshToken: vi.fn(),
        logout: vi.fn(),
        logoutAll: vi.fn(),
    },
}));

vi.mock('../utils/crossTabSync', () => ({
    crossTabSync: {
        subscribe: vi.fn(),
        broadcast: vi.fn(),
    },
}));

describe('useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.mocked(tokenManager.getToken).mockReturnValue(null);
        vi.mocked(tokenManager.getRefreshToken).mockReturnValue(null);
        vi.mocked(tokenManager.getUserId).mockReturnValue(null);
        vi.mocked(tokenManager.getRole).mockReturnValue(null);
        vi.mocked(crossTabSync.subscribe).mockReturnValue(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('hasAccessToken', () => {
        it('should return true when token exists', () => {
            vi.mocked(tokenManager.getToken).mockReturnValue('token');
            const { result } = renderHook(() => useAuthStore());
            expect(result.current.hasAccessToken()).toBe(true);
        });

        it('should return false when token does not exist', () => {
            vi.mocked(tokenManager.getToken).mockReturnValue(null);
            const { result } = renderHook(() => useAuthStore());
            expect(result.current.hasAccessToken()).toBe(false);
        });
    });

    describe('login', () => {
        it('should login successfully and set user state', async () => {
            const credentials = { email: 'test@example.com', password: 'password' };
            const mockResponse = {
                token: 'access-token',
                refreshToken: 'refresh-token',
                sessionId: 'session-id',
                userId: 'user-id',
                tenantId: 'tenant-id',
                role: 'admin',
                expiresIn: 3600,
                refreshExpiresIn: 86400,
            };

            vi.mocked(authApi.login).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.login(credentials);
            });

            expect(authApi.login).toHaveBeenCalledWith(credentials);
            expect(tokenManager.setToken).toHaveBeenCalledWith('access-token');
            expect(tokenManager.setRefreshToken).toHaveBeenCalledWith('refresh-token');
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.user?.email).toBe('test@example.com');
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            vi.mocked(authApi.logout).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.logout();
            });

            expect(authApi.logout).toHaveBeenCalled();
            expect(tokenManager.clearToken).toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.user).toBeNull();
        });

        it('should clear state even if logout API fails', async () => {
            vi.mocked(authApi.logout).mockRejectedValue(new Error('API Error'));

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                try {
                    await result.current.logout();
                } catch (error) {
                }
            });

            expect(tokenManager.clearToken).toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('logoutAll', () => {
        it('should logout all sessions', async () => {
            vi.mocked(authApi.logoutAll).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.logoutAll();
            });

            expect(authApi.logoutAll).toHaveBeenCalled();
            expect(tokenManager.clearToken).toHaveBeenCalled();
        });
    });

    describe('setUser', () => {
        it('should set user and mark as authenticated', () => {
            const { result } = renderHook(() => useAuthStore());
            const user = {
                id: '1',
                email: 'test@example.com',
                name: 'Test',
                role: 'admin' as const,
                tenants: [],
            };

            act(() => {
                result.current.setUser(user);
            });

            expect(result.current.user).toEqual(user);
            expect(result.current.isAuthenticated).toBe(true);
        });
    });

    describe('setTenantId', () => {
        it('should set tenant ID in store and localStorage', () => {
            const { result } = renderHook(() => useAuthStore());

            act(() => {
                result.current.setTenantId('tenant-123');
            });

            expect(result.current.tenantId).toBe('tenant-123');
            expect(localStorage.getItem('selectedTenantId')).toBe('tenant-123');
        });
    });

    describe('initialize', () => {
        it('should initialize with existing token', async () => {
            vi.mocked(tokenManager.getRefreshToken).mockReturnValue('refresh-token');
            vi.mocked(tokenManager.getToken).mockReturnValue('access-token');
            vi.mocked(tokenManager.getUserId).mockReturnValue('user-id');
            vi.mocked(tokenManager.getRole).mockReturnValue('admin');
            localStorage.setItem('userEmail', 'test@example.com');

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.initialize();
            });

            await waitFor(() => {
                expect(result.current.isInitialized).toBe(true);
            });
        });

        it('should refresh token when refresh token exists but access token does not', async () => {
            vi.mocked(tokenManager.getRefreshToken).mockReturnValue('refresh-token');
            vi.mocked(tokenManager.getToken).mockReturnValue(null);
            const mockRefreshResponse = {
                token: 'new-access-token',
                refreshToken: 'new-refresh-token',
                sessionId: 'session-id',
                expiresIn: 3600,
                refreshExpiresIn: 86400,
            };

            vi.mocked(authApi.refreshToken).mockResolvedValue(mockRefreshResponse);
            vi.mocked(tokenManager.getUserId).mockReturnValue('user-id');
            vi.mocked(tokenManager.getRole).mockReturnValue('admin');

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.initialize();
            });

            expect(authApi.refreshToken).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
            expect(tokenManager.setToken).toHaveBeenCalledWith('new-access-token');
        });

        it('should clear state when refresh token fails', async () => {
            vi.mocked(tokenManager.getRefreshToken).mockReturnValue('refresh-token');
            vi.mocked(tokenManager.getToken).mockReturnValue(null);
            vi.mocked(authApi.refreshToken).mockRejectedValue(new Error('Invalid token'));

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.initialize();
            });

            expect(tokenManager.clearToken).toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isInitialized).toBe(true);
        });

        it('should clear state when no refresh token exists', async () => {
            vi.mocked(tokenManager.getRefreshToken).mockReturnValue(null);

            const { result } = renderHook(() => useAuthStore());

            await act(async () => {
                await result.current.initialize();
            });

            expect(tokenManager.clearToken).toHaveBeenCalled();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });
});

