import { FC, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { toast } from '@/shared/components/ui/use-toast';

export const SettingsPage: FC = () => {
    const [activeTab, setActiveTab] = useState<string>('general');
    const [generalSettings, setGeneralSettings] = useState({
        organizationName: 'Acme Corporation',
        timezone: 'UTC',
        currency: 'USD',
    });
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [billingSettings, setBillingSettings] = useState({
        billingEmail: 'billing@acme.com',
        billingAddress: '123 Business St, Suite 100',
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        paymentReminders: true,
        failedPayments: true,
    });
    const [apiKey, setApiKey] = useState('pk_live_51M...8Xz');
    const [originalSettings, setOriginalSettings] = useState({
        general: { organizationName: 'Acme Corporation', timezone: 'UTC', currency: 'USD' },
        billing: { billingEmail: 'billing@acme.com', billingAddress: '123 Business St, Suite 100' },
        notifications: { emailNotifications: true, paymentReminders: true, failedPayments: true },
    });

    const tabs = [
        { id: 'general', label: 'General', icon: 'settings' },
        { id: 'security', label: 'Security', icon: 'lock' },
        { id: 'billing', label: 'Billing', icon: 'payment' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'api', label: 'API Keys', icon: 'key' },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span>Dashboard</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-medium">Settings</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage your account settings and preferences.</p>
                    </div>
                    <div className="flex items-center gap-3"></div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-64 shrink-0">
                        <nav className="flex flex-col gap-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {tabs.find(t => t.id === activeTab)?.label} Settings
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {activeTab === 'general' && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Organization Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={generalSettings.organizationName}
                                                    onChange={(e) => setGeneralSettings({ ...generalSettings, organizationName: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Timezone
                                                </label>
                                                <select 
                                                    value={generalSettings.timezone}
                                                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                >
                                                    <option>UTC</option>
                                                    <option>America/New_York</option>
                                                    <option>America/Los_Angeles</option>
                                                    <option>Europe/London</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Currency
                                                </label>
                                                <select 
                                                    value={generalSettings.currency}
                                                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                >
                                                    <option>USD</option>
                                                    <option>EUR</option>
                                                    <option>GBP</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'security' && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={securitySettings.currentPassword}
                                                    onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={securitySettings.newPassword}
                                                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={securitySettings.confirmPassword}
                                                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-amber-500">warning</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                Two-factor authentication is not enabled. Enable it for additional security.
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    toast({
                                                        title: '2FA Setup',
                                                        description: 'Two-factor authentication setup is not yet available. Please contact support.',
                                                    });
                                                }}
                                                className="ml-auto px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'billing' && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Billing Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={billingSettings.billingEmail}
                                                    onChange={(e) => setBillingSettings({ ...billingSettings, billingEmail: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Billing Address
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={billingSettings.billingAddress}
                                                    onChange={(e) => setBillingSettings({ ...billingSettings, billingAddress: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'notifications' && (
                                    <>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive email alerts for important events</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={notificationSettings.emailNotifications}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Payment Reminders</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Get notified before payment deadlines</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={notificationSettings.paymentReminders}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminders: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Failed Payments</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Alerts when payments fail</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={notificationSettings.failedPayments}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, failedPayments: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'api' && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    API Key
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={apiKey}
                                                        id="api-key-input"
                                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            const input = document.getElementById('api-key-input') as HTMLInputElement;
                                                            if (input) {
                                                                input.select();
                                                                document.execCommand('copy');
                                                                toast({
                                                                    title: 'Copied',
                                                                    description: 'API key copied to clipboard',
                                                                });
                                                            }
                                                        }}
                                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                        title="Copy API key"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const newKey = `pk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                                                            setApiKey(newKey);
                                                            toast({
                                                                title: 'API Key Refreshed',
                                                                description: 'New API key generated',
                                                            });
                                                        }}
                                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                        title="Refresh API key"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    Keep your API keys secure. Do not share them publicly.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button 
                                        onClick={() => {
                                            setGeneralSettings({
                                                organizationName: originalSettings.general.organizationName,
                                                timezone: originalSettings.general.timezone,
                                                currency: originalSettings.general.currency,
                                            });
                                            setBillingSettings({
                                                billingEmail: originalSettings.billing.billingEmail,
                                                billingAddress: originalSettings.billing.billingAddress,
                                            });
                                            setNotificationSettings({
                                                emailNotifications: originalSettings.notifications.emailNotifications,
                                                paymentReminders: originalSettings.notifications.paymentReminders,
                                                failedPayments: originalSettings.notifications.failedPayments,
                                            });
                                            setSecuritySettings({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: '',
                                            });
                                            toast({
                                                title: 'Cancelled',
                                                description: 'Changes have been discarded',
                                            });
                                        }}
                                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (activeTab === 'security' && securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
                                                toast({
                                                    variant: 'destructive',
                                                    title: 'Error',
                                                    description: 'Passwords do not match',
                                                });
                                                return;
                                            }
                                            setOriginalSettings({
                                                general: { ...generalSettings },
                                                billing: { ...billingSettings },
                                                notifications: { ...notificationSettings },
                                            });
                                            toast({
                                                title: 'Success',
                                                description: 'Settings saved successfully',
                                            });
                                        }}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

