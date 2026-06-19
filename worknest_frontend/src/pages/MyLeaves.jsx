import axios from "axios";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import Sidebar from "../components/Sidebar";

function MyLeaves() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const employeeId = decoded.employeeId;
    const role = decoded.role;

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaves`, {
                    params : { employeeId : employeeId, role : role },
                    headers:{ Authorization: `Bearer ${token}`}
                })
                setLeaves(response.data);
            } catch (error) {
                setError(error.response?.data || "Failed to load leaves");
            } finally {
                setLoading(false);
            }
        }
        fetchLeaves()
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">My Leaves</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">Start Date</th>
                            <th className="p-3 text-left">End Date</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves && leaves.map((leave) => {
                            const statusClass = leave.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "REJECTED" ? "bg-red-100 text-red-800"
                            :"bg-yellow-100 text-yellow-800"
                            return (<tr key={leave.id}>
                                <td className="p-3">{leave.leaveType}</td>
                                <td className="p-3">{leave.startDate}</td>
                                <td className="p-3">{leave.endDate}</td>
                                <td className="p-3">{leave.reason}</td>
                                <td className="p-3">
                                    <span className={statusClass}>{leave.status}</span>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyLeaves;