import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            const response = await fetch(`/api/user/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })
            const json = await response.json()
            if (!response.ok) {
                throw new Error(json.error)
            }
            setSuccess(json.message)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="reset-password">
            <h3>Reset Password</h3>
            <form>
                <label>New Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </form>
            <button type="submit" className="reset-btn" onClick={() => handleSubmit}>Reset</button>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    )
}
export default ResetPassword