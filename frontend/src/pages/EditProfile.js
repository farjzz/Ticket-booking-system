import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const EditProfile = () => {
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            setName(json.name)
            setEmail(json.email)
            setProfilePic(json.profilePic)
        }
        if (user) fetchDetails()
    }, [user])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            if (profilePic) formData.append('profilePic', profilePic)
            setIsLoading(true)
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            })
            const json = await response.json()
            if (!response.ok) {
                setIsLoading(false)
                return setError(json.error)
            }
            setError(null)
            setSuccess(true)
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    }

    return (
        <div className="edit-profile">
            <h2>Edit profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Your Profile Picture:</label>
                <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Update Profile"}</button>
            </form>
            {success && <p>Profile updated successfully</p>}
            {error && <p>{error}</p>}
        </div>
    )
}
export default EditProfile