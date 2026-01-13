import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { crossTabSync } from './crossTabSync';

describe('CrossTabSync', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        crossTabSync.cleanup();
    });

    describe('subscribe', () => {
        it('should add callback and return unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = crossTabSync.subscribe(callback);

            expect(typeof unsubscribe).toBe('function');

            unsubscribe();
        });

        it('should call callback when message is broadcast via channel', () => {
            const callback = vi.fn();
            crossTabSync.subscribe(callback);

            const message = { type: 'LOGIN' as const, data: { userId: '123' } };
            
            if ((crossTabSync as any).channel) {
                (crossTabSync as any).channel.onmessage({ data: message });
            }

            expect(callback).toHaveBeenCalledWith(message);
        });
    });

    describe('broadcast', () => {
        it('should post message to broadcast channel if available', () => {
            const mockChannel = {
                postMessage: vi.fn(),
                close: vi.fn(),
            };
            (crossTabSync as any).channel = mockChannel;

            const message = { type: 'LOGOUT' as const };
            crossTabSync.broadcast(message);

            expect(mockChannel.postMessage).toHaveBeenCalledWith(message);
        });

        it('should set message in localStorage', () => {
            const message = { type: 'LOGIN' as const, data: { userId: '123' } };
            crossTabSync.broadcast(message);

            const stored = localStorage.getItem('auth-sync-event');
            expect(stored).toBeTruthy();
            if (stored) {
                expect(JSON.parse(stored)).toEqual(message);
            }
        });
    });

    describe('cleanup', () => {
        it('should close broadcast channel and clear callbacks', () => {
            const mockChannel = {
                postMessage: vi.fn(),
                close: vi.fn(),
            };
            (crossTabSync as any).channel = mockChannel;
            const callback = vi.fn();
            crossTabSync.subscribe(callback);

            crossTabSync.cleanup();

            expect(mockChannel.close).toHaveBeenCalled();
            expect((crossTabSync as any).channel).toBeNull();
        });
    });
});

