import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenManager } from './tokenManager';

describe('TokenManager', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        (tokenManager as any).token = null;
    });

    describe('setToken', () => {
        it('should set token in memory and localStorage', () => {
            tokenManager.setToken('test-token');
            expect(tokenManager.getToken()).toBe('test-token');
            expect(localStorage.getItem('accessToken')).toBe('test-token');
        });
    });

    describe('getToken', () => {
        it('should return token from memory if available', () => {
            tokenManager.setToken('memory-token');
            expect(tokenManager.getToken()).toBe('memory-token');
        });

        it('should return token from localStorage if memory is empty', () => {
            localStorage.setItem('accessToken', 'storage-token');
            expect(tokenManager.getToken()).toBe('storage-token');
        });

        it('should return null if no token exists', () => {
            expect(tokenManager.getToken()).toBeNull();
        });

        it('should load token from localStorage into memory', () => {
            localStorage.setItem('accessToken', 'loaded-token');
            tokenManager.getToken();
            expect(tokenManager.getToken()).toBe('loaded-token');
        });
    });

    describe('setRefreshToken', () => {
        it('should set refresh token in localStorage', () => {
            const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
            tokenManager.setRefreshToken('refresh-token');
            expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
            expect(dispatchEventSpy).toHaveBeenCalled();
        });
    });

    describe('getRefreshToken', () => {
        it('should return refresh token from localStorage', () => {
            localStorage.setItem('refreshToken', 'refresh-token');
            expect(tokenManager.getRefreshToken()).toBe('refresh-token');
        });

        it('should return null if no refresh token exists', () => {
            expect(tokenManager.getRefreshToken()).toBeNull();
        });
    });

    describe('setSessionId', () => {
        it('should set session ID in localStorage', () => {
            tokenManager.setSessionId('session-id');
            expect(localStorage.getItem('sessionId')).toBe('session-id');
        });
    });

    describe('getSessionId', () => {
        it('should return session ID from localStorage', () => {
            localStorage.setItem('sessionId', 'session-id');
            expect(tokenManager.getSessionId()).toBe('session-id');
        });

        it('should return null if no session ID exists', () => {
            expect(tokenManager.getSessionId()).toBeNull();
        });
    });

    describe('setUserId', () => {
        it('should set user ID in localStorage', () => {
            tokenManager.setUserId('user-id');
            expect(localStorage.getItem('userId')).toBe('user-id');
        });
    });

    describe('getUserId', () => {
        it('should return user ID from localStorage', () => {
            localStorage.setItem('userId', 'user-id');
            expect(tokenManager.getUserId()).toBe('user-id');
        });

        it('should return null if no user ID exists', () => {
            expect(tokenManager.getUserId()).toBeNull();
        });
    });

    describe('setRole', () => {
        it('should set role in localStorage', () => {
            tokenManager.setRole('admin');
            expect(localStorage.getItem('role')).toBe('admin');
        });
    });

    describe('getRole', () => {
        it('should return role from localStorage', () => {
            localStorage.setItem('role', 'admin');
            expect(tokenManager.getRole()).toBe('admin');
        });

        it('should return null if no role exists', () => {
            expect(tokenManager.getRole()).toBeNull();
        });
    });

    describe('clearToken', () => {
        it('should clear all tokens and user data', () => {
            const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
            tokenManager.setToken('token');
            tokenManager.setRefreshToken('refresh');
            tokenManager.setSessionId('session');
            tokenManager.setUserId('user');
            tokenManager.setRole('admin');

            tokenManager.clearToken();

            expect(tokenManager.getToken()).toBeNull();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
            expect(localStorage.getItem('sessionId')).toBeNull();
            expect(localStorage.getItem('userId')).toBeNull();
            expect(localStorage.getItem('role')).toBeNull();
            expect(dispatchEventSpy).toHaveBeenCalled();
        });
    });
});

