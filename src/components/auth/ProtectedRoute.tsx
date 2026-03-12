
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Login} from "./Login.tsx";
import {Outlet} from "react-router-dom";


export function ProtectedRoute() {
    const { user } = useAuth();

    if (!user) {
        console.log('Redirecting to /unauthorized');
        return <Login />;
    }

    // If authenticated, render the child routes (which will be wrapped in AuthLayout)
    return <Outlet />;
}
export default ProtectedRoute;