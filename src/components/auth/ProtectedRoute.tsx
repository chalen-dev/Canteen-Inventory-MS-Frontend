import {Outlet, Navigate} from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.tsx";


export function ProtectedRoute() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated, render the child routes (which will be wrapped in AuthLayout)
    return <Outlet />;
}
export default ProtectedRoute;