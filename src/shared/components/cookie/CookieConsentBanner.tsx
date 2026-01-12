import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

interface CookiePreferences {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'fluxpay-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'fluxpay-cookie-preferences';

export const CookieConsentBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

        if (!consent) {
            setIsVisible(true);
        } else if (savedPreferences) {
            try {
                setPreferences(JSON.parse(savedPreferences));
            } catch {
                setIsVisible(true);
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            functional: true,
            analytics: true,
            marketing: true,
        };
        savePreferences(allAccepted);
        setIsVisible(false);
        setShowPreferences(false);
    };

    const handleRejectAll = () => {
        const onlyEssential: CookiePreferences = {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false,
        };
        savePreferences(onlyEssential);
        setIsVisible(false);
        setShowPreferences(false);
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
        setIsVisible(false);
        setShowPreferences(false);
    };

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
        window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { detail: prefs }));
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'essential') return;
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!isVisible) {
        return null;
    }

    return (
        <>
            {showPreferences ? (
                <div 
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl"
                    role="dialog"
                    aria-labelledby="cookie-preferences-title"
                    aria-modal="true"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <h2 id="cookie-preferences-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
                            Cookie Preferences
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                            Manage your cookie preferences. Essential cookies are required for the service to function and cannot be disabled.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Essential Cookies</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Required for authentication, security, and core functionality.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={preferences.essential}
                                        disabled
                                        className="sr-only peer"
                                        aria-label="Essential cookies (required)"
                                    />
                                    <div className="w-11 h-6 bg-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-disabled:opacity-50"></div>
                                </label>
                            </div>

                            <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Functional Cookies</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Remember your preferences and personalize your experience.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={preferences.functional}
                                        onChange={() => togglePreference('functional')}
                                        className="sr-only peer"
                                        aria-label="Functional cookies"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>

                            <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Analytics Cookies</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Help us understand how visitors use our service.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={() => togglePreference('analytics')}
                                        className="sr-only peer"
                                        aria-label="Analytics cookies"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>

                            <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Marketing Cookies</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Used for advertising and marketing purposes (optional).
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => togglePreference('marketing')}
                                        className="sr-only peer"
                                        aria-label="Marketing cookies"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={handleSavePreferences}
                                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px]"
                            >
                                Save Preferences
                            </button>
                            <Link
                                to={ROUTES.COOKIE_POLICY}
                                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                onClick={() => setIsVisible(false)}
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl"
                    role="dialog"
                    aria-labelledby="cookie-consent-title"
                    aria-modal="true"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h2 id="cookie-consent-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                                    We use cookies
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-0">
                                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.{' '}
                                    <Link to={ROUTES.COOKIE_POLICY} className="text-primary hover:text-primary-dark underline">
                                        Learn more
                                    </Link>
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <button
                                    onClick={() => setShowPreferences(true)}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px] whitespace-nowrap"
                                >
                                    Customize
                                </button>
                                <button
                                    onClick={handleRejectAll}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px] whitespace-nowrap"
                                >
                                    Reject All
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px] whitespace-nowrap"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

