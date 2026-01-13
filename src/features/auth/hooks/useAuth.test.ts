import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';
import { useAuthStore } from '../store/authStore';

vi.mock('../store/authStore', () => ({
    useAuthStore: vi.fn(),
}));

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return user, isAuthenticated, login, and logout from store', () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'admin' as const,
            tenants: [],
        };
        const mockLogin = vi.fn();
        const mockLogout = vi.fn();

        vi.mocked(useAuthStore).mockReturnValue({
            user: mockUser,
            isAuthenticated: true,
            login: mockLogin,
            logout: mockLogout,
        } as any);

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.login).toBe(mockLogin);
        expect(result.current.logout).toBe(mockLogout);
    });

    it('should return null user when not authenticated', () => {
        vi.mocked(useAuthStore).mockReturnValue({
            user: null,
            isAuthenticated: false,
            login: vi.fn(),
            logout: vi.fn(),
        } as any);

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
});

