import {Outlet} from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Unauthorized} from "../errors/Unauthorized.tsx";

export function ProtectedRoute() {
    const { user } = useAuth();

    if (!user) {
        return <Unauthorized />;
    }

    // If authenticated, render the child routes (which will be wrapped in AuthLayout)
    return <Outlet />;
}
export default ProtectedRoute;