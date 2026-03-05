import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {COMPANY_NAME} from "../../config/constants.ts";

type LeftSidebarProps = {} & React.HTMLAttributes<HTMLElement>

export function LeftSidebar({...rest}: LeftSidebarProps){
    const navigate = useNavigate();
    return (
        <aside {...rest}>
            <h1>
                {COMPANY_NAME}
            </h1>
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/dashboard">Users</Link>
                <Link to="/dashboard">Orders</Link>
                <Link to="/dashboard">Settings</Link>
            </nav>
            <button className="logout-btn" onClick={() => navigate('/')}>
                Logout
            </button>
        </aside>
    );
}

