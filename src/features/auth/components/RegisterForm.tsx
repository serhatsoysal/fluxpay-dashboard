import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => void;
    isLoading?: boolean;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
                <span className="text-[#111418] dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                    Full Name
                </span>
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Jane Doe"
                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        {...register('fullName')}
                    />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </label>

            <label className="flex flex-col gap-1.5">
                <span className="text-[#111418] dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                    Work Email
                </span>
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                    </span>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        {...register('email')}
                    />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </label>

            <label className="flex flex-col gap-1.5">
                <span className="text-[#111418] dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                    Password
                </span>
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-10 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </label>

            <label className="flex flex-col gap-1.5">
                <span className="text-[#111418] dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                    Confirm Password
                </span>
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    </span>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        {...register('confirmPassword')}
                    />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </label>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span className="truncate">{isLoading ? 'Creating Account...' : 'Create FluxPay Account'}</span>
                {!isLoading && <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>}
            </button>
        </form>
    );
};
