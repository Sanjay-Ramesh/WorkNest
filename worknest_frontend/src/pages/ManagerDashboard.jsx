import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {jwtDecode} from "jwt-decode";

function ManagerDashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const managerId = decoded.employeeId;

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const approveClass = "bg-green-500 text-white px-3 py-1 rounded mr-2";
    const rejectClass = "bg-red-500 text-white px-3 py-1 rounded";

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaves/approvals`, {
                headers : { Authorization : `Bearer ${token}`}
            })
            setLeaves(response.data);
        } catch (error) {
            setError(error.response?.data || "Failed to load leaves");
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (leaveId, leaveStatus) => {
        setProcessingId(leaveId);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/leaves/${leaveId}/status`, null, {
                params : { managerId : managerId, leaveStatus : leaveStatus },
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(prev => prev.filter(leave => leave.id !== leaveId));
        } catch (error) {
            setError(error.response?.data || "Failed to update leave status");
        } finally {
            setProcessingId(null);
        }
    }

    useEffect(() => {
        fetchLeaves()
    }, []);

    return(
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Employee ID</th>
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">Start Date</th>
                            <th className="p-3 text-left">End Date</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Approve/Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves && leaves
                        .filter((leave) => leave.status === "PENDING")
                        .map((leave) => (
                            <tr key={leave.id}>
                                <td className="p-3">{leave.employeeId}</td>
                                <td className="p-3">{leave.leaveType}</td>
                                <td className="p-3">{leave.startDate}</td>
                                <td className="p-3">{leave.endDate}</td>
                                <td className="p-3">{leave.reason}</td>
                                <td className="p-3">
                                    <button 
                                    onClick={() => handleApprove(leave.id, "APPROVED")} 
                                    disabled={processingId === leave.id}
                                    className={`${approveClass} disabled:opacity-50`}>{processingId === leave.id ? "Processing..." : "Approve"}</button>
                                    
                                    <button 
                                    onClick={() => handleApprove(leave.id, "REJECTED")}
                                    disabled={processingId === leave.id} 
                                    className={`${rejectClass} disabled:opacity-50`}>{processingId === leave.id ? "Processing..." : "Reject"}</button>
                                    
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManagerDashboard;