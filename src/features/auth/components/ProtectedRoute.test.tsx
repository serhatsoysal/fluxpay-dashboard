import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../store/authStore';

vi.mock('../store/authStore', () => ({
    useAuthStore: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading when not initialized', () => {
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            if (selector.toString().includes('isInitialized')) {
                return false;
            }
            if (selector.toString().includes('isAuthenticated')) {
                return false;
            }
            return selector({ isInitialized: false, isAuthenticated: false });
        });

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to login when not authenticated', () => {
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            if (selector.toString().includes('isInitialized')) {
                return true;
            }
            if (selector.toString().includes('isAuthenticated')) {
                return false;
            }
            return selector({ isInitialized: true, isAuthenticated: false });
        });

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
        vi.mocked(useAuthStore).mockImplementation((selector: any) => {
            if (selector.toString().includes('isInitialized')) {
                return true;
            }
            if (selector.toString().includes('isAuthenticated')) {
                return true;
            }
            return selector({ isInitialized: true, isAuthenticated: true });
        });

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});

