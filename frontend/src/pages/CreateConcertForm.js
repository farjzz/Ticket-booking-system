import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const CreateConcertForm = () => {
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [genre, setGenre] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [price, setPrice] = useState('')
    const [artist, setArtist] = useState('')
    const [venue, setVenue] = useState('')
    const [seatsTotal, setSeatsTotal] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/concerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, artist, genre, date, time, venue, location, price: Number(price), seatsTotal: Number(seatsTotal), seatsAvailable: Number(seatsTotal) })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setName('')
            setGenre('')
            setArtist('')
            setDate('')
            setTime('')
            setVenue('')
            setLocation('')
            setPrice('')
            setSeatsTotal('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Concert</h2>
            <label>Concert Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Artist:</label>
            <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            <label>Genre:</label>
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <label>Time:</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            <label>Venue:</label>
            <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
            <label>Location:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <label>Price (in rupees):</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <label>Total seats:</label>
            <input type="number" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} required />
            <button type="submit">Create Concert</button>
            {error && <p className="error">{error}</p>}
            {success && (
                <>
                    <p className="success">Concert was created successfully!</p>
                    <Link to='/vendor'>Go to dashboard</Link>
                </>
            )}
        </form>
    )
}
export default CreateConcertForm