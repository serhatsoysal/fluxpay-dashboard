import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: FC = () => {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <main className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
                <Header />
                <div className="flex-1 overflow-y-auto p-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
