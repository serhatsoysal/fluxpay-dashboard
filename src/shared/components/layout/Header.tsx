import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { useUnreadCount } from '@/features/notifications/api/notificationsQueries';
import { ROUTES } from '@/shared/constants/routes';

export const Header: FC = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
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
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 relative">
            <div className="flex w-full max-w-md items-center">
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>search</span>
                    </div>
                    <input
                        ref={searchInputRef}
                        className="block w-full rounded-lg border-0 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:leading-6"
                        placeholder="Search customers, invoices, subscriptions, or products..."
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <kbd className="inline-flex items-center rounded border border-slate-200 px-1 font-sans text-xs text-slate-400">⌘K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative rounded-lg bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none transition-colors"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>notifications</span>
                        {hasUnread && (
                            <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
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
                <div className="h-6 w-px bg-slate-200"></div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    Create New
                </button>
            </div>
        </header>
    );
};
