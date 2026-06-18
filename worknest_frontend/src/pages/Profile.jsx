import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Profile(){
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const employeeId = decoded.employeeId;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await axios.get("http://localhost:8080/api/users/profile", {
                params: {employeeId : employeeId},
                headers:{ Authorization : `Bearer ${token}`}
            })
            setProfile(response.data);
            setLoading(false);
        }
        fetchProfile()
    }, []);

    return(
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="bg-gray-50 flex-1 p-8">
                <h1>Profile</h1>
                {loading && <p>Loading...</p>}
                {profile && (
                    <div className="flex gap-4 mt-6">
                        <div className="bg-white p-6 rounded-lg shadow w-96 mt-6">
                            <p><strong>Employee ID:</strong>{profile.employeeId}</p>
                            <p><strong>Name:</strong>{profile.name}</p>
                            <p><strong>Email:</strong>{profile.email}</p>
                            <p><strong>Role:</strong>{profile.role}</p>
                            <p><strong>Department:</strong>{profile.department}</p>
                            <p><strong>Joined Date:</strong>{profile.joinedDate}</p>
                            <p><strong>Active:</strong>{profile.active ? "Yes":"No"}</p>
                            <p><strong>Created At:</strong>{profile.createdAt}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Profile;