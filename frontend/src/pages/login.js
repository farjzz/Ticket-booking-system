import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email.trim(), password.trim())
    }
    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login</h3>
                <div className="login-details">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-details">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="login-bottom">
                    <Link to='/forgot-password'>Forgot Password</Link>
                    <div className="signup-redirect">
                        <Link to='/signup'>Create a new account</Link>
                    </div>
                </div>
                <button disabled={isLoading} className="login-btn">
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Login