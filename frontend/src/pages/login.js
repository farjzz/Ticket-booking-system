import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const { login, error, isLoading } = useLogin()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email.trim(), password.trim(), role)
    }
    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login</h3>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                </select>
                <button disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Login