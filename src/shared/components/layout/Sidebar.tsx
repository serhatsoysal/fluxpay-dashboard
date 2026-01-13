import { FC, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toast } from '@/shared/components/ui/use-toast';

const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'dashboard' },
    { name: 'Customers', href: ROUTES.CUSTOMERS, icon: 'group' },
    { name: 'Subscriptions', href: ROUTES.SUBSCRIPTIONS, icon: 'subscriptions' },
    { name: 'Invoices', href: ROUTES.INVOICES, icon: 'receipt_long' },
    { name: 'Product Catalog', href: ROUTES.PRODUCTS, icon: 'inventory_2' },
];

const developerNav = [
    { name: 'Webhooks', href: ROUTES.WEBHOOKS, icon: 'webhook' },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: 'settings_applications' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, logoutAll } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isDropdownOpen]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getGradientFromInitials = (initials: string) => {
        const colors = [
            'from-blue-500 to-indigo-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-cyan-500 to-blue-600',
        ];
        const index = initials.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: 'Logged out',
                description: 'You have been successfully logged out',
            });
            navigate(ROUTES.LOGIN);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to logout',
            });
        }
    };

    const handleLogoutAll = async () => {
        try {
            await logoutAll();
            toast({
                title: 'Logged out from all devices',
                description: 'You have been logged out from all devices',
            });
            navigate(ROUTES.LOGIN);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to logout from all devices',
            });
        }
    };

    const userName = user?.name || user?.email || 'User';
    const userEmail = user?.email || '';
    const userRole = user?.role || 'member';
    const initials = getInitials(userName);
    const gradient = getGradientFromInitials(initials);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-sidebar-bg text-slate-300 border-r border-slate-800/50 flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:shadow-none lg:relative",
                isOpen ? "translate-x-0 lg:translate-x-0" : "-translate-x-full lg:-translate-x-full lg:w-0 lg:border-r-0 lg:overflow-hidden"
            )}>
            <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-slate-800/50">
                <img 
                    src="/logo.png" 
                    alt="FluxPay Logo" 
                    className="h-8 sm:h-10 md:h-12 w-auto object-contain object-center"
                    style={{ imageRendering: 'crisp-edges' }}
                />
            </div>

            <nav className="flex-1 overflow-y-auto py-4 sm:py-6 px-2 sm:px-3 flex flex-col gap-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium group min-h-[44px] touch-manipulation',
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <span className={cn(
                                'material-symbols-outlined text-[18px] sm:text-[20px] flex-shrink-0',
                                !isActive && 'group-hover:text-white transition-colors'
                            )}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                <div className="my-2 border-t border-slate-800/50 mx-3"></div>
                <p className="px-2 sm:px-3 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-2">
                    Developers
                </p>

                {developerNav.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium group min-h-[44px] touch-manipulation',
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <span className={cn(
                                'material-symbols-outlined text-[18px] sm:text-[20px] flex-shrink-0',
                                !isActive && 'group-hover:text-white transition-colors'
                            )}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 sm:p-4 border-t border-slate-800/50 relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 sm:gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-left min-h-[44px] touch-manipulation"
                >
                    <div className={cn(
                        "size-8 sm:size-9 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ring-2 ring-white/10 bg-gradient-to-br flex-shrink-0",
                        gradient
                    )}>
                        {initials}
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-medium text-white truncate">{userName}</span>
                        <span className="text-[10px] sm:text-xs text-slate-400 truncate">{userEmail}</span>
                    </div>
                    <span className={cn(
                        "material-symbols-outlined ml-auto text-slate-500 text-[16px] sm:text-[18px] transition-transform flex-shrink-0",
                        isDropdownOpen && "rotate-180"
                    )}>
                        expand_more
                    </span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute bottom-full left-2 sm:left-4 right-2 sm:right-4 mb-2 bg-[#1e293b] rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50 min-w-[200px]">
                        <div className="p-2 sm:p-3 border-b border-slate-700">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{userName}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 truncate">{userEmail}</p>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-1 capitalize">{userRole.replace('_', ' ')}</p>
                        </div>

                        <div className="py-1">
                            <Link
                                to={ROUTES.SETTINGS}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">person</span>
                                <span>Account Settings</span>
                            </Link>
                            <Link
                                to={ROUTES.SESSIONS}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">devices</span>
                                <span>Active Sessions</span>
                            </Link>
                        </div>

                        <div className="border-t border-slate-700 py-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full text-left"
                            >
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">logout</span>
                                <span>Logout</span>
                            </button>
                            <button
                                onClick={handleLogoutAll}
                                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
                            >
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">power_settings_new</span>
                                <span>Logout All Devices</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};
