import { Helmet } from "react-helmet-async";
import { DashboardCard } from "./DashboardCard.tsx";
import { useEffect } from "react";
import { useHeaderTitle } from "../../contexts/HeaderTitleContext.tsx";

export function Dashboard() {
    const { setTitle } = useHeaderTitle();

    useEffect(() => {
        setTitle('Dashboard');
    }, [setTitle]);

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Analytics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Overview of your platform
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard label="Total Users" value="12,345" />
                <DashboardCard label="Revenue" value="$54,678" />
                <DashboardCard label="Orders" value="890" />
                <DashboardCard label="Active Sessions" value="342" />
                <DashboardCard label="Conversion Rate" value="2.4%" />
                <DashboardCard label="Avg. Order Value" value="$61.20" />
            </div>
        </>
    );
}