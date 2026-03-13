import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./components/auth/Login.tsx";
import {Dashboard} from "./components/dashboard/Dashboard.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import {AuthLayout} from "./components/AuthLayout.tsx";
import {GuestLayout} from "./components/auth/GuestLayout.tsx";
import {Unauthorized} from "./components/common/errors/Unauthorized.tsx";
import {RoleBasedRoute} from "./components/auth/RoleBasedRoute.tsx";
import POSInterface from "./components/orders/POSInterface.tsx";
import {Order} from "./components/orders/Order.tsx";
import {MenuList} from "./components/menu/MenuList.tsx";
import {InventoryList} from "./components/inventory/InventoryList.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GuestLayout />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<Login />}/>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<AuthLayout />}>

                        <Route element={<RoleBasedRoute allowedRoles={'admin'} />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>

                        <Route element={<RoleBasedRoute allowedRoles="cashier" />}>
                            <Route path="/pos" element={<POSInterface />} />
                        </Route>

                        <Route element={<RoleBasedRoute allowedRoles={['admin', 'cashier']} />}>
                            <Route path="/menuList" element={<MenuList />} />
                            <Route path="/inventory" element={<InventoryList />} />
                        </Route>

                        <Route element={<RoleBasedRoute allowedRoles="customer" />}>
                            <Route path="/order" element={<Order />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
