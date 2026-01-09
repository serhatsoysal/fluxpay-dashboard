import { FC } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '../store/authStore';
import { toast } from '@/shared/components/ui/use-toast';

export const RegisterPage: FC = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    const handleRegister = async (data: any) => {
        try {
            const nameParts = data.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const emailDomain = data.email.split('@')[1] || 'company';
            const slug = emailDomain.split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');

            await register({
                name: emailDomain.split('.')[0].charAt(0).toUpperCase() + emailDomain.split('.')[0].slice(1) + ' Corporation',
                slug: slug,
                billingEmail: data.email,
                adminEmail: data.email,
                adminPassword: data.password,
                adminFirstName: firstName,
                adminLastName: lastName,
            });

            toast({
                title: 'Account Created',
                description: 'Welcome to FluxPay!',
            });
            navigate(ROUTES.DASHBOARD);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || error.message || 'Failed to create account',
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white selection:bg-primary/20 selection:text-primary">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-slate-50 dark:bg-[#0f172a]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl"></div>
            </div>

            <header className="relative z-20 flex items-center justify-between w-full px-6 py-5 md:px-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 text-[#111418] dark:text-white">
                    <img src="/logo.png" alt="FluxPay Logo" className="h-8 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">Already have an account?</span>
                    <Link
                        to={ROUTES.LOGIN}
                        className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#111418] dark:text-white text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <span className="truncate">Sign In</span>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[480px] flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#151c27] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 p-6 md:p-10">
                        <div className="mb-8 flex flex-col gap-2">
                            <h1 className="text-[#111418] dark:text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">Start managing your subscriptions</h1>
                            <p className="text-[#60708a] dark:text-gray-400 text-sm font-normal leading-relaxed">Join FluxPay today. No credit card required for the sandbox environment.</p>
                        </div>

                        <RegisterForm onSubmit={handleRegister} />

                        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 leading-normal">
                            By clicking "Create FluxPay Account", you agree to our{' '}
                            <a className="text-[#111418] dark:text-white font-medium hover:underline decoration-primary/50 underline-offset-2" href="#">Terms of Service</a>{' '}
                            and{' '}
                            <a className="text-[#111418] dark:text-white font-medium hover:underline decoration-primary/50 underline-offset-2" href="#">Privacy Policy</a>.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 opacity-80">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Trusted by engineering teams at</p>
                        <div className="flex gap-6 items-center grayscale opacity-60 text-slate-500 dark:text-slate-400">
                            <div className="h-6 flex items-center">
                                <svg className="h-5 w-auto" fill="currentColor" viewBox="0 0 100 30">
                                    <path d="M10,15 L20,5 L30,15 L20,25 Z M40,5 H50 V25 H40 Z M60,5 H90 V10 H65 V25 H60 Z"></path>
                                </svg>
                            </div>
                            <div className="h-6 flex items-center">
                                <svg className="h-5 w-auto" fill="currentColor" viewBox="0 0 100 30">
                                    <circle cx="15" cy="15" r="10"></circle>
                                    <rect height="20" rx="2" width="50" x="35" y="5"></rect>
                                </svg>
                            </div>
                            <div className="h-6 flex items-center">
                                <svg className="h-5 w-auto" fill="currentColor" viewBox="0 0 100 30">
                                    <rect height="20" width="20" x="10" y="5"></rect>
                                    <circle cx="60" cy="15" r="10"></circle>
                                    <rect height="20" width="10" x="80" y="5"></rect>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
