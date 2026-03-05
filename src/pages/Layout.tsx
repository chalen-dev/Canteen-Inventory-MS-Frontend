import {LeftSidebar} from "../components/partials/LeftSidebar.tsx";
import { Outlet } from 'react-router-dom';
import {Header} from "../components/partials/Header.tsx";


function Layout() {

    return (
        <>
            <Header />
            <LeftSidebar />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
