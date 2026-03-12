import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./components/auth/Login.tsx";
import {Dashboard} from "./components/dashboard/Dashboard.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import {AuthLayout} from "./components/layouts/AuthLayout.tsx";
import {GuestLayout} from "./components/auth/GuestLayout.tsx";
import {NotFound} from "./components/errors/NotFound.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<GuestLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<NotFound />}/>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
