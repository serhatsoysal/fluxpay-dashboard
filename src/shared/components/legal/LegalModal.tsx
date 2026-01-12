import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const LegalModal: FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
        >
            <div
                className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex-shrink-0">
                    <h2 id="legal-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Close dialog"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        {children}
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors touch-manipulation min-h-[44px]"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

