import {jwtDecode} from "jwt-decode";
import Sidebar from "../components/Sidebar";

function Dashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1">
                <h1>Welcome, {decoded.name}</h1>
                <button>Apply Leave</button>
            </div>
        </div>
        
    )  
}

export default Dashboard