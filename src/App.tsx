import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./components/auth/Login.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import {Dashboard} from "./components/dashboard/Dashboard.tsx";
import GuestLayout from "./components/GuestLayout.tsx";


function App() {

  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route element={<GuestLayout />}>
                      <Route path="/" element={<Login />}/>
                  </Route>
                  <Route element={<AuthLayout />}>
                      <Route path="/dashboard" element={<Dashboard />}/>
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
