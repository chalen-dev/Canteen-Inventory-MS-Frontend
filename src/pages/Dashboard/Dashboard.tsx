import "./Dashboard.css";
import "../../components/partials/Header";
import {Helmet} from "react-helmet-async";

export function Dashboard() {
    //const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <h1>Dashboard</h1>
        </>

    );
}