import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { useUnreadCount } from '@/features/notifications/api/notificationsQueries';
import { ROUTES } from '@/shared/constants/routes';
import { CreateSubscriptionDialog } from '@/features/subscriptions/components/CreateSubscriptionDialog';

interface HeaderProps {
    onMenuClick?: () => void;
    isSidebarOpen?: boolean;
}

export const Header: FC<HeaderProps> = ({ onMenuClick, isSidebarOpen = true }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { data: unreadCount } = useUnreadCount();
    const hasUnread = (unreadCount || 0) > 0;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const query = searchQuery.trim();
            const lowerQuery = query.toLowerCase();

            if (lowerQuery.includes('invoice') || lowerQuery.startsWith('inv-')) {
                navigate(`${ROUTES.INVOICES}?search=${encodeURIComponent(query)}`);
            } else if (lowerQuery.includes('subscription') || lowerQuery.includes('sub')) {
                navigate(`${ROUTES.SUBSCRIPTIONS}?search=${encodeURIComponent(query)}`);
            } else if (lowerQuery.includes('product') || lowerQuery.includes('prod')) {
                navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(query)}`);
            } else {
                navigate(`${ROUTES.CUSTOMERS}?search=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 bg-white dark:bg-background-dark px-2 sm:px-4 md:px-6 lg:px-8 relative gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                        {isSidebarOpen ? 'menu_open' : 'menu'}
                    </span>
                </button>
                <div className="flex-1 max-w-md min-w-0">
                    <div className="relative w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '16px' }}>search</span>
                        </div>
                        <input
                            ref={searchInputRef}
                            className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-1.5 sm:py-2 pl-7 sm:pl-9 pr-6 sm:pr-8 md:pr-12 text-xs sm:text-sm text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:leading-6"
                            placeholder="Search..."
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        <div className="absolute inset-y-0 right-0 hidden md:flex items-center pr-2">
                            <kbd className="inline-flex items-center rounded border border-slate-200 dark:border-slate-700 px-1 font-sans text-[10px] sm:text-xs text-slate-400">⌘K</kbd>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative rounded-lg bg-white dark:bg-slate-800 p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Notifications"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                        {hasUnread && (
                            <span className="absolute right-1 top-1 sm:right-1.5 sm:top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800">
                                {unreadCount && unreadCount > 0 && (
                                    <span className="absolute flex h-full w-full items-center justify-center rounded-full bg-red-500 animate-ping"></span>
                                )}
                            </span>
                        )}
                    </button>
                    <NotificationDropdown
                        isOpen={isNotificationsOpen}
                        onClose={() => setIsNotificationsOpen(false)}
                    />
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                <button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="hidden sm:inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-primary px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all touch-manipulation min-h-[44px]"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    <span className="hidden lg:inline">Create New</span>
                </button>
                <button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="sm:hidden rounded-lg bg-primary p-2 text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
                    aria-label="Create New"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </button>
            </div>
            <CreateSubscriptionDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    if (location.pathname === ROUTES.SUBSCRIPTIONS) {
                        window.location.reload();
                    } else {
                        navigate(ROUTES.SUBSCRIPTIONS);
                    }
                }}
            />
        </header>
    );
};
