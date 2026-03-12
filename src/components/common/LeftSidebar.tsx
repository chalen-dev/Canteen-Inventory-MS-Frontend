import { Link, useNavigate } from "react-router-dom";
import { APP_NAME } from "../../utils/constants.ts";
import { showConfirmation, showToast } from "../../utils/swalHelpers.ts";
import {useState} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";

type LeftSidebarProps = {} & React.HTMLAttributes<HTMLElement>;

export function LeftSidebar({ ...rest }: LeftSidebarProps) {
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const { logout } = useAuth();

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleLogout = async () => {
        const confirmed = await showConfirmation(
            'Log out',
            'Are you sure you want to log out?',
            'info',
            'Yes'
        );

        if (confirmed) {
            showToast('Logged out.', 'info');
            await logout();
            navigate('/', { replace: true });
        }
    };

    return (
        <aside
            {...rest}
            className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col h-screen shadow-sm"
        >
            <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {APP_NAME.charAt(0)}
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {APP_NAME}
                </h1>
            </div>

            <nav className="flex flex-col flex-1">
                <div className="space-y-1 pb-4 border-b border-gray-100 dark:border-gray-800">

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <i className="fas fa-chart-line w-5 text-center" />
                        <span>Dashboard</span>
                    </Link>
                    {/* Orders with collapsible submenu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('orders')}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                          <span className="flex items-center gap-3">
                            <i className="fas fa-shopping-cart w-5 text-center" />
                            <span>Orders</span>
                          </span>
                            <i className={`fas fa-chevron-${openMenus['orders'] ? 'up' : 'down'} text-xs transition-transform`} />
                        </button>

                        {openMenus['orders'] && (
                            <div className="ml-8 mt-1 space-y-1">
                                <Link
                                    to="/dashboard/pos"
                                    className="block px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <i className="fas fa-cash-register w-4 mr-2" />
                                    Point of Sale
                                </Link>
                                {/* Add more sub‑items here */}
                            </div>
                        )}
                    </div>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <i className="fas fa-cog w-5 text-center" />
                        <span>Settings</span>
                    </Link>
                </div>
            </nav>

            <button
                onClick={handleLogout}
                className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary hover:border-primary transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
            >
                <span className="flex items-center gap-2">
                    Logout
                </span>
                <i className="fas fa-sign-out-alt" aria-hidden="true" />
            </button>
        </aside>
    );
}