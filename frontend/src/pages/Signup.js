import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState('user')
    const { signup, error, isLoading } = useSignup()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email.trim(), password.trim(), name.trim(), role)
    }
    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h3>Signup</h3>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                </select>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Sign up"}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Signup