import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./routes/ProtectedRoute";
import ApplyLeave from "./pages/ApplyLeave"
import MyLeaves from "./pages/MyLeaves";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Login />} />
        <Route path = "/dashboard" element = {
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path = "/applyleave" element = {
          <ProtectedRoute>
            <ApplyLeave />
          </ProtectedRoute>} />
          <Route path = "/myleaves" element = {
            <ProtectedRoute>
              <MyLeaves />
            </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
  
}

export default App;