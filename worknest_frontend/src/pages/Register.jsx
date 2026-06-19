import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [employeeId, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [joinedDate, setJoinedDate] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                employeeId : employeeId,
                name : name,
                email : email,
                password : password,
                department : department,
                joinedDate : joinedDate
            })

            navigate("/");
            setMessage("Registration Successful");
        }

        catch(e){
            setError("Registration failed. Please try again.");
        }
    } 

    const inputClass = "border border-gray-300 rounded p-2 w-full"

    return(
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96 flex flex-col gap-3">
                <h1 className="text-2xl font-bold text-center">WorkNest</h1>
                <input type="text" placeholder="EmployeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className={inputClass} />
                <input type="text" placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass} />
                <input type="email" placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass} />
                <input type="password" placeholder="Password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                className={inputClass} />
                <input type="text" placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClass} />
                <input type="date" placeholder="Joined Date"
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                className={inputClass} />
                <button onClick={handleRegister} className="bg-blue-600 text-white p-2 rounded w-full">Register</button>
                <p className="text-center text-sm">Already have an account? <span onClick={() => navigate("/")} className="text-blue-600 cursor-pointer">Login</span></p>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    )
}

export default Register;