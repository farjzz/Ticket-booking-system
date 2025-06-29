import { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from "react-router-dom";

const ChangePassword = () => {
    const { user } = useAuthContext()
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        if (!oldPassword || !newPassword || !confirmPassword) {
            return setError("All fields are required")
        }
        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match")
        }
        setIsLoading(true)
        try {
            const response = await fetch('/api/profile/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            })
            const json = await response.json()
            if (!response.ok) {
                setIsLoading(false)
                throw Error(json.error)
            }
            setSuccess(true)
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    }

    return (
        <div className="change-password">
            <form onSubmit={handleSubmit} className="change-pass-form">
                <h2>Change Password</h2>
                <div className="change-pass-details">
                    <label>Current Password:</label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div className="change-pass-details">
                    <label>New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="change-pass-details">
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button disabled={isLoading} type="submit" className="btn">{isLoading ? "Updating..." : "Update Password"}</button>
                {error && <p className="error">{error}</p>}
                {success && (
                    <>
                        <p>Password changed successfully!</p>
                        <Link to="/">Go to home</Link>
                    </>
                )}
            </form>
        </div>
    )
}
export default ChangePassword