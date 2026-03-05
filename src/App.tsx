
import './App.css'
import {AppRoutes} from "../routes/AppRoutes.tsx";
import {BrowserRouter} from "react-router-dom";


function App() {

  return (
      <>
          <BrowserRouter>
              <AppRoutes/>
          </BrowserRouter>
      </>
  )
}

export default App
