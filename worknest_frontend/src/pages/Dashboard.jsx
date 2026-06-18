import {jwtDecode} from "jwt-decode";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const employeeId = decoded.employeeId;

    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
             const response = await axios.get("http://localhost:8080/api/leaves/balance", {
            params:{ employeeId : employeeId},
            headers:{ Authorization: `Bearer ${token}` }
        })
        setBalance(response.data);
        setLoading(false);
        }
        fetchBalance()
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            
            <div className="bg-gray-50 flex-1 p-8">
                <h1>Welcome, {decoded.name}</h1>
                {loading && <p>Loading...</p>}
                {balance && (
                    <div className="flex gap-4 mt-6">
                        <div className="bg-white p-6 rounded-lg shadow w-48">
                            <p className="text-gray-500 text-sm">Casual Leave</p>
                            <p className="text-3xl font-bold text-blue-600">{balance.casual.remaining}</p>
                            <p className="text-gray-400 text-xs">of {balance.casual.total} remaining</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow w-48">
                            <p className="text-gray-500 text-sm">Sick Leave</p>
                            <p className="text-3xl font-bold text-blue-600">{balance.sick.remaining}</p>
                            <p className="text-gray-400 text-xs">of {balance.sick.total} remaining</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow w-48">
                            <p className="text-gray-500 text-sm">Earned Leave</p>
                            <p className="text-3xl font-bold text-blue-600">{balance.earned.remaining}</p>
                            <p className="text-gray-400 text-xs">of {balance.earned.total} remaining</p>
                        </div>
                    </div>
                )}
                <button>Apply Leave</button>
            </div>
        </div>
        
    )  
}

export default Dashboard