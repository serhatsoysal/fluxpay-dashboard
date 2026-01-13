import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './authApi';
import { apiClient } from '@/shared/api/apiClient';

vi.mock('@/shared/api/apiClient', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

describe('authApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should call apiClient.post with correct parameters', async () => {
            const credentials = { email: 'test@example.com', password: 'password123' };
            const mockResponse = {
                data: {
                    token: 'access-token',
                    refreshToken: 'refresh-token',
                    sessionId: 'session-id',
                    userId: 'user-id',
                    tenantId: 'tenant-id',
                    role: 'admin',
                    expiresIn: 3600,
                    refreshExpiresIn: 86400,
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await authApi.login(credentials);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('register', () => {
        it('should call apiClient.post with correct parameters', async () => {
            const credentials = {
                name: 'Test Corp',
                slug: 'test-corp',
                billingEmail: 'billing@test.com',
                adminEmail: 'admin@test.com',
                adminPassword: 'password123',
                adminFirstName: 'John',
                adminLastName: 'Doe',
            };
            const mockResponse = { data: { success: true } };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await authApi.register(credentials);

            expect(apiClient.post).toHaveBeenCalledWith('/tenants/register', credentials);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('refreshToken', () => {
        it('should call apiClient.post with refresh token', async () => {
            const request = { refreshToken: 'refresh-token' };
            const mockResponse = {
                data: {
                    token: 'new-access-token',
                    refreshToken: 'new-refresh-token',
                    sessionId: 'session-id',
                    expiresIn: 3600,
                    refreshExpiresIn: 86400,
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await authApi.refreshToken(request);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', request);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('logout', () => {
        it('should call apiClient.post for logout', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            await authApi.logout();

            expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
        });
    });

    describe('logoutAll', () => {
        it('should call apiClient.post for logout all', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            await authApi.logoutAll();

            expect(apiClient.post).toHaveBeenCalledWith('/auth/logout-all');
        });
    });

    describe('getSessions', () => {
        it('should call apiClient.get and return sessions', async () => {
            const mockSessions = [
                {
                    sessionId: 'session-1',
                    deviceInfo: {
                        deviceId: 'device-1',
                        deviceType: 'desktop',
                        os: 'Windows',
                        osVersion: '10',
                        browser: 'Chrome',
                        browserVersion: '120',
                    },
                    ipAddress: '192.168.1.1',
                    createdAt: '2024-01-01T00:00:00Z',
                    lastAccess: '2024-01-01T00:00:00Z',
                },
            ];
            const mockResponse = { data: mockSessions };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const result = await authApi.getSessions();

            expect(apiClient.get).toHaveBeenCalledWith('/auth/sessions');
            expect(result).toEqual(mockSessions);
        });
    });

    describe('logoutSession', () => {
        it('should call apiClient.post with session ID', async () => {
            const sessionId = 'session-123';
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            await authApi.logoutSession(sessionId);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/sessions/session-123/logout');
        });
    });
});

