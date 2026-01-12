import { FC } from 'react';

export const TermsOfServiceContent: FC = () => {
    return (
        <>
            <section className="mb-6">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    These Terms of Service constitute a legally binding agreement between you and FluxPay Inc. regarding your use of our financial infrastructure platform and services.
                </p>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    By accessing or using our Service, you agree to be bound by these Terms.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Account Registration</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    To use our Service, you must be at least 18 years of age, provide accurate registration information, and maintain the security of your account credentials. You are responsible for all activities under your account.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Acceptable Use</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    You agree not to use the Service to violate any applicable laws, transmit malicious code, attempt unauthorized access, interfere with the Service, or engage in fraudulent activities.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Intellectual Property</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    The Service and its content are owned by FluxPay and protected by international copyright, trademark, patent, and other intellectual property laws.
                </p>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    You retain ownership of data you submit, and grant FluxPay a license to use it for providing and improving the Service.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Payment Terms</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Fees are charged in advance on a recurring basis. All fees are non-refundable except as required by law. You are responsible for any taxes applicable to your use of the Service.
                </p>
            </section>

            <section className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-3">Limitation of Liability</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    To the maximum extent permitted by law, the Service is provided "AS IS" without warranties. FluxPay shall not be liable for any indirect, incidental, or consequential damages.
                </p>
            </section>
        </>
    );
};

