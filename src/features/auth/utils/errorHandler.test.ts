import { describe, it, expect } from 'vitest';
import { handleAuthError } from './errorHandler';

describe('handleAuthError', () => {
    it('should return SESSION_EXPIRED for expired session', () => {
        const error = {
            response: {
                status: 401,
                data: { message: 'Session Expired' },
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('SESSION_EXPIRED');
        expect(result.message).toBe('Your session has expired. Please login again.');
    });

    it('should return SESSION_INVALID for invalid session', () => {
        const error = {
            response: {
                status: 401,
                data: { message: 'Session Invalid' },
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('SESSION_INVALID');
        expect(result.message).toBe('Invalid session. Please login again.');
    });

    it('should return UNAUTHORIZED for 401 without specific message', () => {
        const error = {
            response: {
                status: 401,
                data: { message: 'Unauthorized' },
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('UNAUTHORIZED');
        expect(result.message).toBe('Authentication failed.');
    });

    it('should return UNAUTHORIZED for 401 without message', () => {
        const error = {
            response: {
                status: 401,
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('UNAUTHORIZED');
        expect(result.message).toBe('Authentication failed.');
    });

    it('should return RATE_LIMITED for 429 status', () => {
        const error = {
            response: {
                status: 429,
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('RATE_LIMITED');
        expect(result.message).toBe('Too many requests. Please try again later.');
    });

    it('should return UNKNOWN for other errors', () => {
        const error = {
            response: {
                status: 500,
            },
        };
        const result = handleAuthError(error);
        expect(result.type).toBe('UNKNOWN');
        expect(result.message).toBe('An error occurred. Please try again.');
    });

    it('should return UNKNOWN for error without response', () => {
        const error = {};
        const result = handleAuthError(error);
        expect(result.type).toBe('UNKNOWN');
        expect(result.message).toBe('An error occurred. Please try again.');
    });
});

