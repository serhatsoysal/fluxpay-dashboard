import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
    confirmVariant?: 'default' | 'danger';
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    icon = 'published_with_changes',
    confirmVariant = 'default'
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-modal border border-slate-100 dark:border-slate-800 transform transition-all scale-100 opacity-100 flex flex-col overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="p-6 pt-8 sm:p-8">
                    <div className="flex flex-col gap-5">
                        <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]">{icon}</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white tracking-tight">
                                {title}
                            </h3>
                            <div className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {description}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={confirmVariant === 'danger' 
                                ? "flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all"
                                : "flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                            }
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent"></div>
            </div>
        </div>,
        document.body
    );
};
