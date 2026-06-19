import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function HRDashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const [todayLeaves, setTodayLeaves] = useState(null);
    const [pendingLeaves, setPendingLeaves] = useState(null);
    const [departmentData, setDepartmentData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllDatas = async () => {
            try {
                const [todayRes, pendingRes, deptRes, summaryRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/todayleave`, {
                    headers: { Authorization : `Bearer ${token}`} }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/pendingleaves`, {
                    headers: { Authorization : `Bearer ${token}`} }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/department`, {
                    headers: { Authorization : `Bearer ${token}`} }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/summary`, {
                    headers: { Authorization : `Bearer ${token}`} })
                ]);
                setTodayLeaves(todayRes.data);
                setPendingLeaves(pendingRes.data);
                setDepartmentData(deptRes.data);
                setSummaryData(summaryRes.data);
            } catch (error) {
                setError(error.response?.data || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        }

        fetchAllDatas();
    }, []);

    return(
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6"> HR Dashboard</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                <div>
                    <h2>Today Leaves</h2>
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Employee ID</th>
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayLeaves && todayLeaves.map((todayLeave) => {
                            return (<tr key={todayLeave.id}>
                                <td className="p-3">{todayLeave.employeeId}</td>
                                <td className="p-3">{todayLeave.leaveType}</td>
                                <td className="p-3">{todayLeave.reason}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                </div>
                <div>
                    <h2>Pending Leaves</h2>
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
                        {pendingLeaves && pendingLeaves.map((pendingLeave) => {
                            return (<tr key={pendingLeave.id}>
                                <td className="p-3">{pendingLeave.employeeId}</td>
                                <td className="p-3">{pendingLeave.leaveType}</td>
                                <td className="p-3">{pendingLeave.startDate}</td>
                                <td className="p-3">{pendingLeave.endDate}</td>
                                <td className="p-3">{pendingLeave.reason}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                </div>
                <div>
                    <h2>Department Breakdown</h2>
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Department</th>
                            <th className="p-3 text-left">Leave Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departmentData && Object.entries(departmentData).map(([deptName, count]) => {
                            return (<tr key={deptName}>
                                <td className="p-3">{deptName}</td>
                                <td className="p-3">{count}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                </div>
                <div>
                    <h2>Summary</h2>
                    <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">Average Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryData && Object.entries(summaryData).map(([leaveType, avgBalance]) => {
                            return (<tr key={leaveType}>
                                <td className="p-3">{leaveType}</td>
                                <td className="p-3">{avgBalance}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                </div>                
            </div>
        </div>
    )

}

export default HRDashboard;