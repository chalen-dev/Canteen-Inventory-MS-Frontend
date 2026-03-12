
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {LoadingScreen} from "../common/loading/LoadingScreen.tsx";


export function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    // If authenticated, render the child routes (which will be wrapped in AuthLayout)
    return <Outlet />;
}
export default ProtectedRoute;