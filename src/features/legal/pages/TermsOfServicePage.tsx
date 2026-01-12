import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export const TermsOfServicePage: FC = () => {
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
                        Terms of Service
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <main className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-8 sm:mb-12" aria-labelledby="agreement">
                        <h2 id="agreement" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Agreement to Terms
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These Terms of Service ("Terms") constitute a legally binding agreement between you and FluxPay Inc. ("FluxPay," "we," "our," or "us") regarding your use of our financial infrastructure platform and services (the "Service").
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use the Service.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="service-description">
                        <h2 id="service-description" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Description of Service
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            FluxPay provides a comprehensive financial infrastructure platform that enables businesses to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>Process payments and manage transactions</li>
                            <li>Handle subscription billing and invoicing</li>
                            <li>Manage customer relationships and product catalogs</li>
                            <li>Integrate with third-party services via API</li>
                            <li>Access analytics and reporting tools</li>
                        </ul>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="account-registration">
                        <h2 id="account-registration" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Account Registration and Security
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            To use our Service, you must:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
                            <li>Provide accurate, current, and complete registration information</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized access or security breach</li>
                        </ul>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="acceptable-use">
                        <h2 id="acceptable-use" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Acceptable Use
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>Violate any applicable laws, regulations, or third-party rights</li>
                            <li>Transmit any malicious code, viruses, or harmful data</li>
                            <li>Attempt to gain unauthorized access to the Service or related systems</li>
                            <li>Interfere with or disrupt the integrity or performance of the Service</li>
                            <li>Engage in fraudulent, deceptive, or illegal activities</li>
                            <li>Collect or store personal data about other users without authorization</li>
                            <li>Use the Service for any purpose that violates our policies or guidelines</li>
                        </ul>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Violation of these terms may result in immediate termination of your account and legal action.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="intellectual-property">
                        <h2 id="intellectual-property" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Intellectual Property Rights
                        </h2>
                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Our Intellectual Property
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            The Service and its original content, features, and functionality are owned by FluxPay and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without prior written consent from FluxPay.
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Your Content
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            You retain ownership of any data, content, or materials you submit, post, or display through the Service ("Your Content"). By using the Service, you grant FluxPay a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute Your Content solely for the purpose of providing and improving the Service.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            You represent and warrant that you have all necessary rights to grant this license and that Your Content does not violate any third-party rights.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="payment-terms">
                        <h2 id="payment-terms" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Payment Terms
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            If you purchase any paid services:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>You agree to pay all fees associated with your subscription</li>
                            <li>Fees are charged in advance on a recurring basis (monthly or annually)</li>
                            <li>All fees are non-refundable except as required by law</li>
                            <li>We reserve the right to change our pricing with 30 days' notice</li>
                            <li>Failure to pay may result in suspension or termination of your account</li>
                            <li>You are responsible for any taxes applicable to your use of the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="limitation-liability">
                        <h2 id="limitation-liability" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Limitation of Liability
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND</li>
                            <li>FLUXPAY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                            <li>FLUXPAY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                            <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE CLAIM</li>
                        </ul>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="indemnification">
                        <h2 id="indemnification" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Indemnification
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            You agree to indemnify, defend, and hold harmless FluxPay and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any third-party rights.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="termination">
                        <h2 id="termination" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Termination
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Upon termination, your right to use the Service will cease immediately. You may terminate your account at any time by contacting us or using the account settings in the Service.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="governing-law">
                        <h2 id="governing-law" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Governing Law and Dispute Resolution
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="changes">
                        <h2 id="changes" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Changes to Terms
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="contact">
                        <h2 id="contact" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Contact Information
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6">
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-2">
                                <strong>FluxPay Inc.</strong>
                            </p>
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">
                                Email: <a href="mailto:legal@fluxpay.com" className="text-primary hover:text-primary-dark underline">legal@fluxpay.com</a>
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

