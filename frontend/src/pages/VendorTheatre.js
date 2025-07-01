import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const VendorTheatre = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [movies, setMovies] = useState([])
    const [shows, setShows] = useState({})
    const [theatre, setTheatre] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [deleted, setDeleted] = useState(false)
    useEffect(() => {
        if (!user) return
        const fetchMoviesAndShows = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/shows/bytheatre?theatre=${id}`, {
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
                const showsMap = {}
                for (let m of uniqueMovies) {
                    const showResponse = await fetch(`/api/shows?theatre=${id}&movie=${m._id}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const showJson = await showResponse.json()
                    if (!showResponse.ok) {
                        throw Error(showJson.error)
                    }
                    showsMap[m._id] = showJson
                }
                setShows(showsMap)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchMoviesAndShows()
    }, [user, id])
    useEffect(() => {
        const fetchTheatre = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/theatres/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setTheatre(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchTheatre()
    }, [id, user])
    const deleteTheatre = async () => {
        try {
            const response = await fetch(`/api/theatres/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setDeleted(true)
            setTimeout(() => {
                navigate('/vendor')
            }, 2000)
        } catch (error) {
            setError(error.message)
        }
    }
    const deleteShow = async (showId) => {
        try {
            const response = await fetch(`/api/shows/${showId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setShows(prev => prev.filter(s => s._id != showId))
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="theatre-detailss">
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {theatre && (
                <div className="theatre">
                    <div className="theatre-details">
                        <div className="theatre-name">
                            <h3>{theatre.theatre_name}</h3>
                            <span onClick={() => deleteTheatre()} className="material-symbols-outlined del">delete</span>
                        </div>
                        <p>{theatre.location}</p>
                        <p>Total Seats: {theatre.seatsTotal}</p>
                    </div>
                    {deleted && <p>Theatre and all shows associated with it was deleted!</p>}
                </div>
            )}
            {!isLoading && movies.length == 0 && <p>No movies screened</p>}
            {movies.length != 0 && (
                <>
                    <h3>Movies Screened</h3>
                    <div className="movie">
                        {!isLoading && movies.map(m => (
                            <div className="moviee">
                                <div className="the-movie">
                                    <img src={m.poster} alt="movie-poster" />
                                    <div className="movie-info">
                                        <h4>{m.name}</h4>
                                        <p><em>Genre:</em> {m.genre}</p>
                                        <p><em>Language:</em> {m.language}</p>
                                        <p><em>Description:</em> {m.description}</p>
                                        <p><em>Duration:</em> {m.durationInMins} mins</p>
                                    </div>
                                </div>
                                <h3>Shows available</h3>
                                <div className="shows">
                                    {shows[m._id]?.map(s => (
                                        <div className="show-card">
                                            <div className="show">
                                                <p><em>Date:</em> {new Date(s.date).toLocaleDateString()}</p>
                                                <p><em>Time:</em> {s.time}</p>
                                                <p><em>Price:</em> ₹{s.price}</p>
                                                <p><em>Seats booked:</em> {theatre.seatsTotal - s.seatsAvailable}</p>
                                                <p><em>Seats left:</em> {s.seatsAvailable}</p>
                                            </div>
                                            <span onClick={() => deleteShow(s._id)} className="material-symbols-outlined del-icon">delete</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default VendorTheatre