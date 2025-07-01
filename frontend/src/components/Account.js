import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { forwardRef } from "react";

const AccTab = forwardRef(({ setShowAccTab }, ref) => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const navigate = useNavigate()

    if (!user) return null
    return (
        <div className="acc-tab" ref={ref}>
            <h3>Your Account</h3>
            <div className="profile-info">
                <img src={user.profilePic || "/uploads/default-avatar-1.png"} alt="profile" className="profile-pic" />
                <div className="user-info">
                    <div>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                    </div>
                    <Link to={"/edit-profile"} onClick={() => setShowAccTab(false)}><span className="material-symbols-outlined">edit</span></Link>
                </div>
            </div>
            <div className="acc-tabs">
                <button onClick={() => setShowAccTab(false)}><Link to={"/bookings"}>Bookings</Link></button>
                <button onClick={() => setShowAccTab(false)}><Link to={"/change-password"}>Change Password</Link></button>
                <button className='btnn' onClick={() => {
                    logout()
                    navigate('/login')
                    setShowAccTab(false)
                }}>Logout</button>
            </div>
        </div >
    )
})

export default AccTab