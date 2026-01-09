import { FC } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../store/authStore';
import { toast } from '@/shared/components/ui/use-toast';
import { ROUTES } from '@/shared/constants/routes';

export const LoginPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((state) => state.login);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login(data);
            toast({
                variant: 'success',
                title: 'Success',
                description: 'Successfully logged in',
            });

            const state = location.state as { from?: { pathname: string } } | null;
            const from = state?.from?.pathname || ROUTES.DASHBOARD;
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to login',
            });
        }
    };

    return (
        <div className="min-h-screen flex w-full overflow-hidden">
            <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-[#101722] w-full lg:w-1/2 border-r border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex items-center gap-2 mb-10">
                        <img src="/logo.png" alt="FluxPay Logo" className="h-8 w-auto" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Please enter your details to sign in to your dashboard.
                        </p>
                    </div>

                    <div className="mt-8">
                        <LoginForm onSubmit={handleLogin} />

                        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            New to FluxPay?{' '}
                            <Link
                                to={ROUTES.REGISTER}
                                className="font-semibold leading-6 text-primary hover:text-primary-dark transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                            <span>© 2024 FluxPay Inc.</span>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    Terms
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex relative w-0 flex-1 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black z-0"></div>
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage:
                            'linear-gradient(#3c83f6 1px, transparent 1px), linear-gradient(to right, #3c83f6 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                ></div>

                <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-24 w-full">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white border border-white/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            System Operational
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 max-w-lg">
                        <div className="size-14 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <span className="material-symbols-outlined text-white text-3xl">bar_chart_4_bars</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Billing orchestration for the modern enterprise.
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Scale your recurring revenue with FluxPay's robust API and automated invoicing engine.
                            Trusted by high-growth SaaS teams globally.
                        </p>

                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-3">
                            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                Trusted by engineering teams at
                            </p>
                            <div className="flex flex-wrap gap-6 opacity-70 grayscale">
                                <span className="text-white font-bold text-lg tracking-tight">AcmeCorp</span>
                                <span className="text-white font-bold text-lg tracking-tighter italic">GlobalSync</span>
                                <span className="text-white font-bold text-lg">KINETIC</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>256-bit SSL Secured Connection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
