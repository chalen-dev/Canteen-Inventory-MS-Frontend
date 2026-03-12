// components/errors/Unauthorized.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.tsx";

export function Unauthorized() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const from = location.state?.from?.pathname || '/';
    const reason = location.state?.reason; // 'role' or undefined

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-4 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <h1 className="text-6xl font-bold text-red-500 mt-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    {reason === 'role' ? 'Access Denied' : 'Unauthorized'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {reason === 'role'
                        ? "You don't have permission to view this page."
                        : 'You need to be logged in to access this page.'}
                </p>
                <button
                    onClick={() => navigate(user ? '/dashboard' : '/', { state: { from } })}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all active:scale-[0.98] shadow-sm hover:shadow-md mt-4"
                >
                    {user ? 'Go to Dashboard' : 'Go to Login'}
                </button>
            </div>
        </div>
    );
}