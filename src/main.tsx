import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/swal.css'
import App from './App.tsx'
import { HelmetProvider } from "react-helmet-async"
import {ThemeProvider} from "./contexts/ThemeContext.tsx";
import {HeaderTitleProvider} from "./contexts/HeaderTitleContext.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <HelmetProvider>
              <HeaderTitleProvider>
                  <ThemeProvider>
                      <App />
                  </ThemeProvider>
              </HeaderTitleProvider>
          </HelmetProvider>
      </AuthProvider>
  </StrictMode>,
)
