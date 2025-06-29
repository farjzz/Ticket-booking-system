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
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="theatre-details">
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {theatre && (
                <div className="theatre">
                    <h3>{theatre.theatre_name}</h3>
                    <p>{theatre.location}</p>
                    <p>Total Seats: {theatre.seatsTotal}</p>
                    <button onClick={() => deleteTheatre}>Delete Theatre</button>
                    {deleted && <p>Theatre and all shows associated with it was deleted!</p>}
                </div>
            )}
            {!isLoading && movies.map(m => (
                <div className="movie">
                    <h4>{m.name}</h4>
                    <p>Genre: {m.genre}</p>
                    <p>Language: {m.language}</p>
                    <p>Description: {m.description}</p>
                    <p>Duration: {m.durationInMins} mins</p>
                    {shows[m._id]?.map(s => (
                        <div className="show">
                            <p>Date: {new Date(s.date).toLocaleDateString()}</p>
                            <p>Show time: {s.time}</p>
                            <p>Price: ₹{s.price}</p>
                            <p>Seats booked: {theatre.seatsTotal - s.seatsAvailable}</p>
                            <p>Seats left: {s.seatsAvailable}</p>
                            <button onClick={() => deleteShow(s._id)}>Delete Show</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default VendorTheatre