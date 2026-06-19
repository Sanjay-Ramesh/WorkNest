import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

function ApplyLeave() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const employeeId = decoded.employeeId;

    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const applyLeaveClass = "border border-gray-300 rounded p-2 w-96";

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");
        setError(null);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/leaves/apply`, {
                employeeId : employeeId,
                leaveType : leaveType,
                startDate : startDate,
                endDate : endDate,
                reason : reason,
            }, {
                headers : { Authorization : `Bearer ${token}` }
            });
            setMessage("Leave Applied Successfully");
        } catch (error) {
            setError(error.response?.data || "Failed to apply leave");
        } finally {
            setLoading(false);
        }
    } 

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <div className="flex flex-col gap-4 max-w-md">
                    <h1 className="text-2xl fond-bold">Apply Leave</h1>
                    <div className="flex flex-col gap-4">
                        <select className={applyLeaveClass} value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                            <option value="">Select Leave Type</option>
                            <option value="CASUAL">Casual</option>
                            <option value="SICK">Sick</option>
                            <option value="EARNED">Earned</option>
                        </select>
                        <input className={applyLeaveClass} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <input className={applyLeaveClass} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <input className={applyLeaveClass} type="text" placeholder="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                        <button className="bg-blue-600 text-white p-2 rounded w-96" disabled={loading} onClick={handleSubmit}>{loading? "Submitting..." : "Submit"}</button>
                        {message && <p className="text-green-600">{message}</p>}
                        {error && <p className="text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplyLeave;