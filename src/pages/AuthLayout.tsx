import { LeftSidebar } from "../components/partials/LeftSidebar";
import { Outlet } from 'react-router-dom';
import { Header } from "../components/partials/Header";

function AuthLayout() {
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

export default AuthLayout;