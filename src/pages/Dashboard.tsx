
import "../components/partials/Header.tsx";
import {Helmet} from "react-helmet-async";
import {Card} from "../components/partials/Card.tsx";

export function Dashboard() {
    //const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <h1>Analytics</h1>
            <Card />
            <Card />
        </>

    );
}