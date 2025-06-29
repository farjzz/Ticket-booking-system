import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import AccTab from './Account'
const Navbar = () => {
    const { user } = useAuthContext()
    const [showAccTab, setShowAccTab] = useState(false)
    const toggleAccTab = () => setShowAccTab(prev => !prev)
    return (
        <header className="navbar">
            <div className="nav-logo">
                <Link to='/' className="logo">BookItAll</Link>
            </div>
            <div className="nav-right">
                {!user && (
                    <div className="log-sign">
                        <Link to='/login' className="nav-link">Login</Link>
                        <Link to='/signup' className="nav-link">Signup</Link>
                    </div>
                )}
                {user && (
                    <div className="profile">
                        <img src={user.profilePic ? `/uploads/${user.profilePic}` : '/uploads/default-avatar.png'} alt="profile" className="profilePic" onClick={toggleAccTab} />
                        {showAccTab && <AccTab />}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar