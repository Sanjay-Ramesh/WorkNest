import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode";

function ProtectedRoute({children, allowedRoles}) {
    const token = localStorage.getItem("token");

    if(!token)
        return <Navigate to = '/' />;
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if(allowedRoles && !allowedRoles.includes(role))
        return <Navigate to="/dashboard" />
        
    return children;
}

export default ProtectedRoute