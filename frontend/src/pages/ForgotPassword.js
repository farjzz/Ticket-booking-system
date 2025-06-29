import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const response = await fetch('/api/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            const json = await response.json()
            if (!response.ok) {
                throw new Error(json.error)
            }
            setMessage(json.message)
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="forgot-password">
            <h3>Forgot password</h3>
            <form onSubmit={handleSubmit}>
                <div className="forgot-password-details">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="reset-password-btn">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    )
}
export default ForgotPassword