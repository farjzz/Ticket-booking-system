import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
const Navbar = () => {
    const { user } = useAuthContext()
    return (
        <header className="navbar">
            <div className="nav-logo">
                <Link to='/' className="logo">BookItAll</Link>
            </div>
            <div className="search">
                <input type="text" placeholder='Search' className="search-bar" />
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
                        <img src={user.profilePic ? `/uploads/${user.profilePic}` : '/uploads/default-avatar.png'} alt="profile" className="profilePic" />
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar