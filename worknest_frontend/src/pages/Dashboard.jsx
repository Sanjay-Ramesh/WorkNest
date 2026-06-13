import {jwtDecode} from "jwt-decode";

function Dashboard() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    console.log(decoded);

    return (
        <div>
            <h1>Welcome, {decoded.name}</h1>
            <button>Apply Leave</button>
        </div>
    )  
}

export default Dashboard