import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login.tsx";
import Layout from "./pages/Layout.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";


function App() {

  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Login />}/>
                  <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />}/>
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
