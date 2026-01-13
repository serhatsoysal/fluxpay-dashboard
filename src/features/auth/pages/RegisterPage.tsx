import { FC, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { toast } from '@/shared/components/ui/use-toast';
import { LegalModal } from '@/shared/components/legal/LegalModal';
import { PrivacyPolicyContent } from '@/shared/components/legal/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/shared/components/legal/TermsOfServiceContent';

export const RegisterPage: FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    const handleRegister = async (data: any) => {
        try {
            const nameParts = data.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const emailParts = data.email.split('@');
            const emailLocal = emailParts[0] || 'user';
            const emailDomain = emailParts[1] || 'company';
            const domainName = emailDomain.split('.')[0].toLowerCase();
            
            const slug = `${emailLocal}-${domainName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            const tenantName = domainName.charAt(0).toUpperCase() + domainName.slice(1) + ' Corporation';

            await authApi.register({
                name: tenantName,
                slug: slug,
                billingEmail: data.email,
                adminEmail: data.email,
                adminPassword: data.password,
                adminFirstName: firstName,
                adminLastName: lastName,
            });

            await logout();

            toast({
                title: 'Account Created Successfully',
                description: 'Your account has been created. Please sign in to continue.',
            });

            navigate(ROUTES.LOGIN);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.response?.data?.message || error.message || 'Failed to create account. Please try again.',
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

            <header className="relative z-20 flex items-center justify-between w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 max-w-7xl mx-auto">
                <div className="flex items-center min-h-[52px] text-[#111418] dark:text-white">
                    <img 
                        src="/logo.png" 
                        alt="FluxPay Logo" 
                        className="h-10 sm:h-12 w-auto object-contain object-center"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">Already have an account?</span>
                    <Link
                        to={ROUTES.LOGIN}
                        className="flex items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#111418] dark:text-white text-xs sm:text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm touch-manipulation min-h-[44px]"
                    >
                        <span className="truncate">Sign In</span>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[480px] flex flex-col gap-4 sm:gap-6">
                    <div className="bg-white dark:bg-[#151c27] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 p-5 sm:p-6 md:p-8 lg:p-10">
                        <div className="mb-6 sm:mb-8 flex flex-col gap-2">
                            <h1 className="text-[#111418] dark:text-white tracking-tight text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Start managing your subscriptions</h1>
                            <p className="text-[#60708a] dark:text-gray-400 text-xs sm:text-sm font-normal leading-relaxed">Join FluxPay today. No credit card required for the sandbox environment.</p>
                        </div>

                        <RegisterForm onSubmit={handleRegister} />

                        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                            By clicking "Create FluxPay Account", you agree to our{' '}
                            <button
                                type="button"
                                onClick={() => setIsTermsModalOpen(true)}
                                className="text-primary dark:text-blue-400 font-semibold hover:underline decoration-primary/50 underline-offset-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                            >
                                Terms of Service
                            </button>{' '}
                            and{' '}
                            <button
                                type="button"
                                onClick={() => setIsPrivacyModalOpen(true)}
                                className="text-primary dark:text-blue-400 font-semibold hover:underline decoration-primary/50 underline-offset-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
                            >
                                Privacy Policy
                            </button>
                            .
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Trusted by engineering teams at
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 px-4">
                            <div className="flex items-center justify-center h-8 px-4">
                                <span className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-400 tracking-tight">AcmeCorp</span>
                            </div>
                            <div className="flex items-center justify-center h-8 px-4">
                                <span className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-400 tracking-tighter italic">GlobalSync</span>
                            </div>
                            <div className="flex items-center justify-center h-8 px-4">
                                <span className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-400 uppercase">KINETIC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <LegalModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
                title="Privacy Policy"
            >
                <PrivacyPolicyContent />
            </LegalModal>

            <LegalModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                title="Terms of Service"
            >
                <TermsOfServiceContent />
            </LegalModal>
        </div>
    );
};
