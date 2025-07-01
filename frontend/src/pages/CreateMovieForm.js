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
            formData.append('language', language)
            formData.append('description', description)
            formData.append('durationInMins', Number(durationInMins))
            if (poster) formData.append('poster', poster)
            const response = await fetch('/api/movies', {
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
            setLanguage('')
            setDescription('')
            setDurationInMins('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='create-event'>
            <h3>Add a New Movie</h3>
            <div className="entry">
                <label>Movie Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Genre:</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Language:</label>
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Duration (in mins):</label>
                <input type="number" value={durationInMins} onChange={(e) => setDurationInMins(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="entry">
                <label>Upload Movie Poster:</label>
                <input type="file" onChange={(e) => setPoster(e.target.files[0])} />
            </div>
            <button type="submit" className="btn">Create Movie</button>
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