import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export const CookiePolicyPage: FC = () => {
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
                        Cookie Policy
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
                            This Cookie Policy explains how FluxPay Inc. ("we," "our," or "us") uses cookies and similar tracking technologies on our website and service (the "Service"). It explains what these technologies are, why we use them, and your rights to control our use of them.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            By using our Service, you consent to the use of cookies in accordance with this policy. You can manage your cookie preferences at any time through your browser settings or our cookie consent banner.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="what-are-cookies">
                        <h2 id="what-are-cookies" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            What Are Cookies?
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps improve your browsing experience and allows websites to provide personalized content.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="types-of-cookies">
                        <h2 id="types-of-cookies" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Types of Cookies We Use
                        </h2>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Essential Cookies
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These cookies are necessary for the Service to function and cannot be switched off in our systems. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6 mb-6">
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Purpose:</strong> Authentication, security, and core functionality
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Duration:</strong> Session or up to 1 year
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                <strong>Examples:</strong> Session tokens, authentication cookies, security cookies
                            </p>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Functional Cookies
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6 mb-6">
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Purpose:</strong> Remember your preferences, language settings, and personalized features
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Duration:</strong> Up to 1 year
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                <strong>Examples:</strong> User preferences, language selection, theme settings
                            </p>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Analytics Cookies
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. This helps us improve the Service and user experience.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6 mb-6">
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Purpose:</strong> Analyze usage patterns, track page views, and improve service performance
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Duration:</strong> Up to 2 years
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                <strong>Examples:</strong> Google Analytics, service performance tracking
                            </p>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Marketing Cookies
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            These cookies are used to track visitors across websites to display relevant advertisements. They are only set with your consent.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6 mb-6">
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Purpose:</strong> Track user behavior for advertising and marketing purposes
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Duration:</strong> Up to 2 years
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                <strong>Examples:</strong> Advertising trackers, social media pixels (only with consent)
                            </p>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="third-party-cookies">
                        <h2 id="third-party-cookies" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Third-Party Cookies
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements, and so on. These third parties may set their own cookies or similar technologies on your device.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We use the following third-party services that may set cookies:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4 mt-4">
                            <li><strong>Google Analytics:</strong> Web analytics service (with your consent)</li>
                            <li><strong>Payment Processors:</strong> Cookies for secure payment processing</li>
                            <li><strong>Customer Support:</strong> Cookies for support chat functionality</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="cookie-duration">
                        <h2 id="cookie-duration" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Cookie Duration
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Cookies can be either "session" cookies or "persistent" cookies:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser. They are essential for the Service to function properly.</li>
                            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them. They help us recognize you when you return to the Service.</li>
                        </ul>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="managing-cookies">
                        <h2 id="managing-cookies" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Managing Your Cookie Preferences
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            You have the right to accept or reject cookies. You can control and manage cookies in various ways:
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Cookie Consent Banner
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            When you first visit our Service, you will see a cookie consent banner where you can choose which types of cookies to accept. You can change your preferences at any time by clicking the "Cookie Preferences" link in our footer.
                        </p>

                        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 mt-6">
                            Browser Settings
                        </h3>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, if you disable cookies, some parts of our Service may not function properly.
                        </p>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            Here are links to cookie settings for popular browsers:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 ml-4">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark underline">Microsoft Edge</a></li>
                        </ul>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 mt-6">
                            <p className="text-sm sm:text-base text-blue-900 dark:text-blue-300">
                                <strong>Note:</strong> Please be aware that disabling essential cookies may impact your ability to use certain features of our Service, including authentication and security functions.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="do-not-track">
                        <h2 id="do-not-track" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Do Not Track Signals
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. Our Service does not respond to DNT signals at this time, but we respect your cookie preferences as set through our cookie consent banner.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="updates">
                        <h2 id="updates" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Updates to This Cookie Policy
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-8 sm:mb-12" aria-labelledby="contact">
                        <h2 id="contact" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Contact Us
                        </h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6">
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-2">
                                <strong>FluxPay Inc.</strong>
                            </p>
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">
                                Email: <a href="mailto:privacy@fluxpay.com" className="text-primary hover:text-primary-dark underline">privacy@fluxpay.com</a>
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

