import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function ManagerDashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const managerId = decoded.employeeId;
    const role = decoded.role;

    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaves = async () => {
            const response = await axios.get("http://localhost:8080/api/leaves", {
                params : {
                    employeeId : managerId,
                    role : role
                },
                headers : { Authorization : `Bearer ${token}`}
            })
            setLeaves(response.data)
        }
        fetchLeaves()
    }, []);

    return(
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Employee ID</th>
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">Start Date</th>
                            <th className="p-3 text-left">End Date</th>
                            <th className="p-3 text-left">Reason</th>
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
                                    <button>Approve</button>
                                    <button>Reject</button>
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