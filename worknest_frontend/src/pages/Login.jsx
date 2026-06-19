import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import {jwtDecode} from "jwt-decode";

function Login() {
    //const { isDark, setIsDark } = useContext(ThemeContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            email : email,
            password : password
        })

        const token = response.data.token;
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        if (decoded.role === "EMPLOYEE")
            navigate("/dashboard");
        else if (decoded.role === "HR_ADMIN")
            navigate("/hrdashboard");
        else
            navigate("/managerdashboard");
        }

        catch(e){
            setError("Invalid Email or Password");
        }   
    }

    const bgClass = "bg-gray-50 min-h-screen flex items-center justify-center";
    /*isDark
    ? "bg-neutral-900 min-h-screen flex items-center justify-center"
    :*/ 

    const cardClass = "bg-white p-8 rounded-lg w-96 flex flex-col gap-3"
    /*isDark 
    ? "bg-neutral-700 p-8 rounded-lg w-96 text-white flex flex-col gap-3"
    :*/ 

    const inputClass = "border border-gray-300 rounded p-2 w-full"
    /*isDark
    ? "border border-neutral-600 text-white rounded p-2 w-full border border-neutral-500"
    :*/ 

    return (
        <div className={bgClass}>

           {/* <button onClick={() => setIsDark(!isDark)} className={`absolute top-4 right-4 text-sm border px-3 py-1 rounded ${isDark ? "text-white border-white" : "text-gray-800 border-gray-400"}`}>Toggle Theme</button> */}
            <div className={cardClass}>
                <h1 className="text-2xl font-bold text-center">WorkNest</h1>
                <input type="email" placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}/>
                <input type="password" placeholder="Password" 
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                className={inputClass}/>
                <button onClick={handleLogin} className="bg-blue-600 text-white p-2 rounded w-full">Login</button>
                <p className="text-center text-sm">Don't have an account? <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer">Register</span></p>
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="bg-blue-50 p-3 rounded text-sm text-gray-600">
                <p className="font-semibold mb-1">Demo Accounts: </p>
                <p>👤 Employee: emp@worknest.com / demo123</p>
                <p>👔 Manager: manager@worknest.com / demo123</p>
                <p>🏢 HR Admin: hr@worknest.com / demo123 </p>
            </div>
        </div>
    )
}

export default Login