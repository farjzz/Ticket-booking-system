import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const AccTab = () => {
    const { user } = useAuthContext()
    if (!user) return null
    return (
        <div className="acc-tab">
            <div className="profile-info">
                <img src={user.profilePic || "/default-avatar.png"} alt="profile" className="profile-pic" />
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <Link to={"/edit-profile"}>
                    <button>Edit profile</button>
                </Link>
            </div>
            <div className="acc-tabs">
                <Link to={"/bookings"}>
                    <button>Bookings</button>
                </Link>
                <Link to={"/change-password"}>
                    <button>Change Password</button>
                </Link>
                <Link to={"/bookings"}>
                    <button>Logout</button>
                </Link>
            </div>
        </div>
    )
}

export default AccTab