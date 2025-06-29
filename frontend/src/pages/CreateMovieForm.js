import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const CreateMovieForm = () => {
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [genre, setGenre] = useState('')
    const [language, setLanguage] = useState('')
    const [description, setDescription] = useState('')
    const [durationInMins, setDurationInMins] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, genre, language, description, durationInMins: Number(durationInMins) })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setName('')
            setGenre('')
            setLanguage('')
            setDescription('')
            setDurationInMins('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Movie</h2>
            <label>Movie Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Genre:</label>
            <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            <label>Language:</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <label>Duration (in mins):</label>
            <input type="number" value={durationInMins} onChange={(e) => setDurationInMins(e.target.value)} required />
            <button type="submit">Create Movie</button>
            {error && <p className="error">{error}</p>}
            {success && (
                <>
                    <p className="success">Movie was created successfully!</p>
                    <Link to='/vendor'>Go to dashboard</Link>
                </>
            )}
        </form>
    )
}
export default CreateMovieForm