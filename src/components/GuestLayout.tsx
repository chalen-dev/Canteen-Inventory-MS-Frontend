import { Outlet } from 'react-router-dom';
import { Header } from "./common/Header.tsx";

function GuestLayout() {
    return (
        <div className="flex">
            <main className="flex-1 flex flex-col min-h-screen">
                <Header includeIcon={true} />
                <div className="flex-1 bg-gray-50 dark:bg-gray-800">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default GuestLayout;