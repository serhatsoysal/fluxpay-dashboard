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
import { SubscriptionDetailPage } from '@/features/subscriptions/pages/SubscriptionDetailPage';
import { CreateSubscriptionPage } from '@/features/subscriptions/pages/CreateSubscriptionPage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage';
import { InvoicesPage } from '@/features/invoices/pages/InvoicesPage';
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage';
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage';
import { PaymentDetailPage } from '@/features/payments/pages/PaymentDetailPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage';
import { WebhooksPage } from '@/features/webhooks/pages/WebhooksPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { PrivacyPolicyPage } from '@/features/legal/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/features/legal/pages/TermsOfServicePage';
import { CookiePolicyPage } from '@/features/legal/pages/CookiePolicyPage';
import { CookieConsentBanner } from '@/shared/components/cookie/CookieConsentBanner';
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
                <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
                <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
                <Route path={ROUTES.COOKIE_POLICY} element={<CookiePolicyPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                    <Route path={ROUTES.SUBSCRIPTIONS} element={<SubscriptionsPage />} />
                    <Route path={ROUTES.CREATE_SUBSCRIPTION} element={<CreateSubscriptionPage />} />
                    <Route path={ROUTES.SUBSCRIPTION_DETAIL} element={<SubscriptionDetailPage />} />
                    <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
                    <Route path={ROUTES.CUSTOMER_DETAIL} element={<CustomerDetailPage />} />
                    <Route path={ROUTES.INVOICES} element={<InvoicesPage />} />
                    <Route path={ROUTES.INVOICE_DETAIL} element={<InvoiceDetailPage />} />
                    <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
                    <Route path={ROUTES.PAYMENT_DETAIL} element={<PaymentDetailPage />} />
                    <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
                    <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                    <Route path={ROUTES.WEBHOOKS} element={<WebhooksPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path={ROUTES.SESSIONS} element={<SessionsPage />} />
                    <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                </Route>
            </Routes>
            <CookieConsentBanner />
        </BrowserRouter>
    );
};
