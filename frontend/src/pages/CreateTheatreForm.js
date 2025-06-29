import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const CreateTheatreForm = () => {
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [seatsTotal, setSeatsTotal] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/theatres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ theatre_name: name, location, seatsTotal: Number(seatsTotal) })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setName('')
            setLocation('')
            setSeatsTotal('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Theatre</h2>
            <label>Theatre Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <label>Total seats:</label>
            <input type="number" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} required />
            <button type="submit">Create Theatre</button>
            {error && <p className="error">{error}</p>}
            {success && (
                <>
                    <p className="success">Theatre was created successfully!</p>
                    <Link to='/vendor'>Go to dashboard</Link>
                </>
            )}
        </form>
    )
}
export default CreateTheatreForm