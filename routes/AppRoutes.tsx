import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import {Dashboard} from "../pages/Dashboard/Dashboard";
import Layout from "../src/Layout.tsx";

export function AppRoutes() {
    return (
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
                <Route path="/" element={<Login/>}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
    );
}

