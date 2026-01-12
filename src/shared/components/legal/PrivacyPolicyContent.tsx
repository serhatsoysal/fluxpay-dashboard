import { FC } from 'react';

export const PrivacyPolicyContent: FC = () => {
    return (
        <>
            <section className="mb-6">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    FluxPay Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial infrastructure platform and services.
                </p>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    By using our Service, you agree to the collection and use of information in accordance with this policy.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Information We Collect</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    We collect information that you provide directly to us, including name, email address, business information, payment details, account credentials, and billing information.
                </p>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    We also automatically collect device information, usage data, log files, and cookies when you use our Service.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">How We Use Your Information</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    We use collected information to provide, maintain, and improve our Service, process transactions, communicate with you, detect and prevent security threats, comply with legal obligations, and personalize your experience.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Data Security</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information. We are SOC 2 compliant and adhere to PCI DSS Level 1 standards.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Your Rights</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Depending on your location, you may have rights to access, correct, delete, or port your data. European users have additional rights under GDPR, and California residents have specific rights under CCPA.
                </p>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    To exercise these rights, contact us at <a href="mailto:privacy@fluxpay.com" className="text-primary hover:text-primary-dark underline">privacy@fluxpay.com</a>.
                </p>
            </section>
        </>
    );
};

