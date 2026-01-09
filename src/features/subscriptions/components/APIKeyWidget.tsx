import { FC, useState } from 'react';

export const APIKeyWidget: FC = () => {
    const [copied, setCopied] = useState(false);
    const apiKey = 'pk_live_51M...8Xz';

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="lg:col-span-1 bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-slate-400">key</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">API Keys</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Use your publishable keys to authenticate API requests on your client-side code.
                </p>
            </div>

            <div className="mt-4 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Publishable Key</span>
                    <span className="text-[10px] font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                        Active
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                        {apiKey}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title={copied ? 'Copied!' : 'Copy'}
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                    </button>
                </div>
            </div>

            <button className="mt-4 w-full py-2 text-sm text-slate-700 dark:text-slate-300 font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Manage Keys
            </button>
        </div>
    );
};

