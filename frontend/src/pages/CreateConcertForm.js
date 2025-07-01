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
    const [description, setDescription] = useState('')
    const [poster, setPoster] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('genre', genre)
            formData.append('artist', artist)
            formData.append('date', date)
            formData.append('time', time)
            formData.append('venue', venue)
            formData.append('location', location)
            formData.append('price', price)
            formData.append('seatsTotal', seatsTotal)
            formData.append('description', description)
            if (poster) formData.append('poster', poster)
            const response = await fetch('/api/concerts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
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
        <form onSubmit={handleSubmit} className='create-event'>
            <h3>Add a New Concert</h3>
            <div className="entry">
                <label>Concert Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Artist:</label>
                <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Genre:</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Time:</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Venue:</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Price (in rupees):</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Total seats:</label>
                <input type="number" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Upload Concert Poster:</label>
                <input type="file" onChange={(e) => setPoster(e.target.files[0])} />
            </div>
            <button type="submit" className="btn">Create Concert</button>
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