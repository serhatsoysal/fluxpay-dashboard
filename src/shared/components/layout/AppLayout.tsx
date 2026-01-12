import { FC, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:bg-black/30 transition-opacity"
                    onClick={closeSidebar}
                />
            )}
            <main className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark min-w-0 transition-all duration-300">
                <Header 
                    onMenuClick={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
