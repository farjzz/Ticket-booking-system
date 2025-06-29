import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const AddMovieForm = () => {
    const { user } = useAuthContext()
    const [theatres, setTheatres] = useState([])
    const [selectedTheatre, setSelectedTheatre] = useState(null)
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [price, setPrice] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false) //gotta use this.. in class as well!
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        if (!user) return
        const fetchMovies = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/shows/bytheatre?theatre=${selectedTheatre}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                const uniqueMovies = [...new Map(json.map(s => [s.movie._id, s.movie])).values()]
                setMovies(uniqueMovies)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchMovies()
    }, [user, selectedTheatre])
    useEffect(() => {
        const fetchTheatres = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/vendor?type=Theatre', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    setIsLoading(false)
                    throw Error(json.error)
                }
                setTheatres(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        if (user.role == 'vendor') fetchTheatres()
    }, [user])
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/shows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ date, time, price: Number(price), movie: selectedMovie, theatre: selectedTheatre })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setDate('')
            setTime('')
            setPrice('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            {theatres.length == 0 && <p>No theatres available</p>}
            <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                <option value="">--- Select a Theatre ---</option>
                {theatres.map(t => (
                    <option value={t._id} key={t._id}>{t.theatre_name}</option>
                ))}
            </select>
            {selectedTheatre && (
                <div>
                    {movies.length == 0 && <p>No movies available. Add a movie to this theatre first.</p>}
                    <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                        <option value="">--- Select a Movie ---</option>
                        {movies.map(m => (
                            <option value={m._id} key={m._id}>{m.name}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedMovie && (
                <div>
                    <h2>Add a New Show</h2>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <label>Time:</label>
                    <input type="time" value={location} onChange={(e) => setTime(e.target.value)} required />
                    <label>Price (in rupees):</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <button type="submit">Create Show</button>
                    {success && <p className="success">Show was created successfully!</p>}
                    <Link to='/vendor-dashboard'>Go to dashboard</Link>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </form>
    )
}
export default AddMovieForm