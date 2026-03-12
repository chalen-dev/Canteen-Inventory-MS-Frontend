import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { LeftSidebar } from '../common/sidebar/LeftSidebar.tsx';

export function AuthLayout() {
    return (
        <div className="flex">
            <LeftSidebar />
            <main className="flex-1 flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}