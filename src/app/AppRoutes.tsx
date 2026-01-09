import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { SessionsPage } from '@/features/auth/pages/SessionsPage';
import { DashboardPage } from '@/features/analytics/pages/DashboardPage';
import { SubscriptionsPage } from '@/features/subscriptions/pages/SubscriptionsPage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { InvoicesPage } from '@/features/invoices/pages/InvoicesPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { WebhooksPage } from '@/features/webhooks/pages/WebhooksPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/features/auth/store/authStore';

const RootRedirect: FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    
    return <LandingPage />;
};

export const AppRoutes: FC = () => {
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                    <Route path={ROUTES.SUBSCRIPTIONS} element={<SubscriptionsPage />} />
                    <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
                    <Route path={ROUTES.INVOICES} element={<InvoicesPage />} />
                    <Route path={ROUTES.PAYMENTS} element={<div>Payments Page</div>} />
                    <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
                    <Route path={ROUTES.WEBHOOKS} element={<WebhooksPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path={ROUTES.SESSIONS} element={<SessionsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
