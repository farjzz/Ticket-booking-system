import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const EditProfile = () => {
    const { user, dispatch } = useAuthContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [edit, setEdit] = useState(false)
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
            const updatedUser = { ...user, name: json.user.name, email: json.user.email, profilePic: json.user.profilePic }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            dispatch({ type: 'LOGIN', payload: updatedUser })

        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    }

    return (
        <div className="edit-profile">
            <form onSubmit={handleSubmit} className="edit-form">
                <h2>Edit profile</h2>
                <div className="profile-preview">
                    <img src={profilePic ? URL.createObjectURL(profilePic) : (user.profilePic ? user.profilePic : '/uploads/default-avatar-1.png')} alt="Profile Preview" className="profile-pic" />
                    <label><span className="material-symbols-outlined" onClick={() => setEdit(true)}>edit</span></label>
                    {edit && <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />}
                </div>
                <div className="edit-details">
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="edit-details">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="btn" type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Update Profile"}</button>
                {success && (
                    <>
                        <p>Profile updated successfully</p>
                        <Link to='/'>Go to Home page</Link>
                    </>
                )}
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}
export default EditProfile