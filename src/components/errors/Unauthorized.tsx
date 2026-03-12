import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useHeaderTitle } from "../../contexts/HeaderTitleContext";

export function Unauthorized() {
    const navigate = useNavigate();
    const { setTitle } = useHeaderTitle();

    useEffect(() => {
        setTitle("Access Denied");
    }, [setTitle]);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-4 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-6xl font-bold text-red-500 mt-4">403</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
                        Access Denied
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        You need to be logged in to view this page.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}