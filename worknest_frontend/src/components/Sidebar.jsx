import {Link, useNavigate} from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="bg-neutral-900 w-64 flex flex-col p-4 text-white gap-2">
            <h1 className="text-x1 font-bold mb-6">WorkNest</h1>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/applyleave">Apply Leave</Link>
            <Link to="/myleaves">My Leaves</Link>
            <Link to="/Profile">Profile</Link>
            <button onClick={handleLogout} className="mt-auto">Logout</button>
        </div>
    )
}

export default Sidebar;

