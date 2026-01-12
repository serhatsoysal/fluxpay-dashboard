import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export const PrivacyPolicyPage: FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <header className="mb-8 sm:mb-12">
                    <Link 
                        to={ROUTES.HOME} 
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6 sm:mb-8 touch-manipulation"
                        aria-label="Back to home"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <main className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-8 sm:mb-12" aria-labelledby="introduction">
                        <h2 id="introduction" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Introduction
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            FluxPay Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial infrastructure platform and services (the "Service").
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="data-collection">
                        <h2 id="data-collection" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Information We Collect
                        </h2>
                        
                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Personal Information
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>Name, email address, and contact information</li>
                            <li>Business information and payment details</li>
                            <li>Account credentials and authentication data</li>
                            <li>Billing and transaction information</li>
                            <li>Customer support communications</li>
                        </ul>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Automatically Collected Information
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            When you use our Service, we automatically collect certain information, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>Device information (IP address, browser type, operating system)</li>
                            <li>Usage data (pages visited, features used, time spent)</li>
                            <li>Log files and analytics data</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="data-usage">
                        <h2 id="data-usage" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            How We Use Your Information
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We use the collected information for various purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>To provide, maintain, and improve our Service</li>
                            <li>To process transactions and manage your account</li>
                            <li>To communicate with you about your account and our services</li>
                            <li>To detect, prevent, and address technical issues and security threats</li>
                            <li>To comply with legal obligations and enforce our terms</li>
                            <li>To personalize your experience and provide customer support</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="data-sharing">
                        <h2 id="data-sharing" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Information Sharing and Disclosure
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our Service</li>
                            <li><strong>Payment Processors:</strong> With payment processing partners to facilitate transactions</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="cookies">
                        <h2 id="cookies" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Cookies and Tracking Technologies
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            For more detailed information about our use of cookies, please refer to our{' '}
                            <Link to={ROUTES.COOKIE_POLICY} className="text-primary hover:text-primary-dark underline">
                                Cookie Policy
                            </Link>.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="data-security">
                        <h2 id="data-security" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Data Security
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We are SOC 2 compliant and adhere to PCI DSS Level 1 standards to ensure the security of financial data.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="user-rights">
                        <h2 id="user-rights" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Your Rights and Choices
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li><strong>Access:</strong> Request access to your personal information</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                            <li><strong>Objection:</strong> Object to processing of your personal information</li>
                            <li><strong>Restriction:</strong> Request restriction of processing</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                        </ul>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            To exercise these rights, please contact us at{' '}
                            <a href="mailto:privacy@fluxpay.com" className="text-primary hover:text-primary-dark underline">
                                privacy@fluxpay.com
                            </a>.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            <strong>GDPR (European Users):</strong> If you are located in the European Economic Area, you have additional rights under the General Data Protection Regulation.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                            <strong>CCPA (California Users):</strong> California residents have specific rights under the California Consumer Privacy Act, including the right to know what personal information is collected and the right to opt-out of the sale of personal information.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="data-retention">
                        <h2 id="data-retention" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Data Retention
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="children">
                        <h2 id="children" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Children's Privacy
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="changes">
                        <h2 id="changes" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Changes to This Privacy Policy
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="contact">
                        <h2 id="contact" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Contact Us
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6">
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-2">
                                <strong>FluxPay Inc.</strong>
                            </p>
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-2">
                                Email: <a href="mailto:privacy@fluxpay.com" className="text-primary hover:text-primary-dark underline">privacy@fluxpay.com</a>
                            </p>
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">
                                Data Protection Officer: <a href="mailto:dpo@fluxpay.com" className="text-primary hover:text-primary-dark underline">dpo@fluxpay.com</a>
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

