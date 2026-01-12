import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/shared/components/ui/label';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isLoading?: boolean;
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                    Email address
                </Label>
                <div className="mt-2">
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-base sm:text-sm sm:leading-6 dark:bg-[#1e293b]/50 bg-white transition-all touch-manipulation"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                        Password
                    </Label>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = 'mailto:support@fluxpay.com?subject=Password Reset Request';
                        }}
                        className="font-medium text-primary hover:text-primary-dark transition-colors text-sm"
                    >
                        Forgot password?
                    </a>
                </div>
                <div className="relative mt-2">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="block w-full rounded-lg border-0 py-3 px-4 pr-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-base sm:text-sm sm:leading-6 dark:bg-[#1e293b]/50 bg-white transition-all touch-manipulation"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{errors.password.message}</p>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
                >
                    {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                </button>
            </div>
        </form>
    );
};
