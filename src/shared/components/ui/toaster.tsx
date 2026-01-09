import * as React from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, ToastAction } from './toast';
import { useToast } from './use-toast';

const getToastIcon = (variant?: string | null) => {
    switch (variant) {
        case 'success':
            return <span className="material-symbols-outlined text-emerald-500 text-[24px]">check_circle</span>;
        case 'destructive':
            return <span className="material-symbols-outlined text-rose-500 text-[24px]">error</span>;
        case 'default':
        default:
            return <span className="material-symbols-outlined text-primary text-[24px]">info</span>;
    }
};

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, variant, ...props }) {
                return (
                    <Toast key={id} variant={variant} {...props}>
                        <div className="flex-shrink-0">
                            {getToastIcon(variant)}
                        </div>
                        <div className="flex-1 pt-0.5">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                            {action && (
                                <div className="mt-3">
                                    {React.isValidElement(action) && (action.type as any)?.displayName === ToastAction.displayName
                                        ? React.cloneElement(action as React.ReactElement, { variant })
                                        : action}
                                </div>
                            )}
                        </div>
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
