  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Login from "./pages/Login";
  import Dashboard from "./pages/Dashboard"
  import ProtectedRoute from "./routes/ProtectedRoute";
  import ApplyLeave from "./pages/ApplyLeave"
  import MyLeaves from "./pages/MyLeaves";
  import ManagerDashboard from "./pages/ManagerDashboard";
  import Profile from "./pages/Profile";
  import HRDashboard from "./pages/HRDashboard";

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
          <Route path="/managerdashboard" element = {
            <ProtectedRoute  allowedRoles = {["MANAGER", "HR_ADMIN", "SUPER_ADMIN"]}>
              <ManagerDashboard />
            </ProtectedRoute>} />
          <Route path="/profile" element = {
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
          <Route path="/hrdashboard" element = {
            <ProtectedRoute allowedRoles={["HR_ADMIN", "SUPER_ADMIN"]}>
              <HRDashboard />
            </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    )
    
  }

  export default App;