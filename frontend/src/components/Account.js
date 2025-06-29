import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const AccTab = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const navigate = useNavigate()
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
                <button onClick={() => {
                    logout()
                    navigate('/login')
                }}>Logout</button>
                <Link to={"/bookings"}>

                </Link>
            </div>
        </div>
    )
}

export default AccTab