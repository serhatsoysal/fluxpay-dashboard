import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            'fixed top-20 right-4 sm:right-6 lg:right-10 z-50 flex flex-col gap-4 w-full max-w-sm pointer-events-none',
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
    'pointer-events-auto w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-toast p-4 flex gap-3 transform translate-x-0 transition-all duration-300 hover:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
    {
        variants: {
            variant: {
                default: '',
                destructive: '',
                success: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <ToastPrimitives.Root
            ref={ref}
            className={cn(toastVariants({ variant }), className)}
            {...props}
        />
    );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Action>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
        variant?: 'default' | 'destructive' | 'success';
        asChild?: boolean;
    }
>(({ className, variant, asChild, ...props }, ref) => {
    const variantClasses = variant === 'destructive' 
        ? 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
        : 'text-primary hover:text-primary-dark';
    
    return (
        <ToastPrimitives.Action
            ref={ref}
            asChild={asChild}
            className={cn(
                'text-sm font-medium transition-colors',
                variantClasses,
                className
            )}
            {...props}
        />
    );
});
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        className={cn(
            'flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-6 w-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700',
            className
        )}
        toast-close=""
        {...props}
    >
        <span className="material-symbols-outlined text-[18px]">close</span>
    </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Title>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold text-slate-900 dark:text-white', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Description ref={ref} className={cn('text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
    type ToastProps,
    type ToastActionElement,
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
};
