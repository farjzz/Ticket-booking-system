import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import AccTab from './Account'
const Navbar = () => {
    const { user } = useAuthContext()
    const [showAccTab, setShowAccTab] = useState(false)
    const tabRef = useRef()
    const toggleAccTab = () => setShowAccTab(prev => !prev)
    useEffect(() => {
        const handleClick = (e) => {
            if (tabRef.current && !tabRef.current.contains(e.target)) {
                setShowAccTab(false)
            }
        }
        if (showAccTab) {
            document.addEventListener('mousedown', handleClick)
        }
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [showAccTab])
    return (
        <header className="navbar">
            <div className="nav-logo">
                <Link to='/' className="logo">BookItAll</Link>
            </div>
            <div className="nav-right">
                {user && user == 'vendor' && (
                    <Link to='/create-event' className='nav-link'>Create New Event</Link>
                )}
                {!user && (
                    <div className="log-sign">
                        <Link to='/login' className="nav-link">Login</Link>
                        <Link to='/signup' className="nav-link">Signup</Link>
                    </div>
                )}
                {user && (
                    <div className="profile">
                        <img src={user.profilePic ? user.profilePic : '/uploads/default-avatar.png'} alt="profile" className="profilePic" onClick={toggleAccTab} />
                        {showAccTab && <AccTab ref={tabRef} setShowAccTab={setShowAccTab} />}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar