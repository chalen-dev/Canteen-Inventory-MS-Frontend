import { Outlet } from 'react-router-dom';
import { Header } from './common/Header.tsx';
import { NavSidebar } from './common/nav_sidebar/NavSidebar.tsx';

export function AuthLayout() {
    return (
        <div className="flex">
            <NavSidebar />
            <main className="flex-1 flex flex-col min-h-screen ml-64">
                <Header />
                <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}