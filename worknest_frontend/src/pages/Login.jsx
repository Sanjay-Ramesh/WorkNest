import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import {jwtDecode} from "jwt-decode";

function Login() {
    const { isDark, setIsDark } = useContext(ThemeContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const response = await axios.post("http://localhost:8080/api/auth/login", {
            email : email,
            password : password
        })

        const token = response.data.token;
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        if(decoded.role === "EMPLOYEE")
            navigate("/dashboard");
        else
            navigate("/managerdashboard");
        }

        catch(e){
            setError("Invalid Email or Password");
        }   
    }

    const bgClass = isDark
    ? "bg-neutral-900 min-h-screen flex items-center justify-center"
    : "bg-gray-50 min-h-screen flex items-center justify-center"

    const cardClass = isDark 
    ? "bg-neutral-700 p-8 rounded-lg w-96 text-white flex flex-col gap-3"
    : "bg-white p-8 rounded-lg w-96 flex flex-col gap-3"

    const inputClass = isDark
    ? "border border-neutral-600 text-white rounded p-2 w-full border border-neutral-500"
    : "border border-gray-300 rounded p-2 w-full"

    return (
        <div className={bgClass}>
            <button onClick={() => setIsDark(!isDark)} className={`absolute top-4 right-4 text-sm border px-3 py-1 rounded ${isDark ? "text-white border-white" : "text-gray-800 border-gray-400"}`}>Toggle Theme</button>
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
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    )
}

export default Login