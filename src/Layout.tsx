
import './App.css'
import {AppRoutes} from "../routes/AppRoutes.tsx";
import {LeftSidebar} from "../components/partials/LeftSidebar.tsx";
import {Helmet} from "react-helmet-async";
import { Outlet } from 'react-router-dom';


function Layout() {

    return (
        <>
            <AppRoutes/>
            <Helmet>
                <title></title>
            </Helmet>
            <LeftSidebar/>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
