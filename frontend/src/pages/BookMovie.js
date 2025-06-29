import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'

const BookMovie = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [theatres, setTheatres] = useState([])
    const [cities, setCities] = useState([])
    const [shows, setShows] = useState([])
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedTheatre, setSelectedTheatre] = useState(null)
    const [selectedShow, setSelectedShow] = useState(null)
    const [seats, setSeats] = useState(1)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [booked, setBooked] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    const { user } = useAuthContext()
    useEffect(() => {
        if (!user) {
            setError('You must be logged in to book tickets')
            setIsLoading(false)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [user])
    useEffect(() => {
        if (!user) return
        setSelectedShow(null)
        setSeats(1)
        const fetchShows = async () => {
            if (!selectedTheatre) return
            try {
                const response = await fetch(`/api/shows?theatre=${selectedTheatre}&movie=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setShows(json)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchShows()
    }, [selectedTheatre, user])
    useEffect(() => {
        if (!user) return
        const fetchTheatres = async () => {
            try {
                const response = await fetch(`/api/shows/bymovie?movie=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                const uniqueTheatres = [...new Map(json.map(s => [s.theatre._id, s.theatre])).values()]
                setTheatres(uniqueTheatres)
                const citiesUnique = [...new Set(uniqueTheatres.map(t => t.location))]
                setCities(citiesUnique)
                setIsLoading(false)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchTheatres()
    }, [id, user])
    useEffect(() => {
        setSelectedTheatre(null)
        setSelectedShow(null)
        setSeats(1)
    }, [selectedCity])
    const theatresInCity = selectedCity ? theatres.filter(t => t.location == selectedCity) : []
    const selectedTheatreObj = theatres.find(t => t._id == selectedTheatre)
    const selectedShowObj = shows.find(s => s._id == selectedShow)
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    return (
        <div className="movie-booking">
            {cities.length == 0 && (
                <p>No shows available</p>
            )}
            {cities.length != 0 && (
                <>
                    <h3>Select City</h3>
                    <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedTheatre(null); setSelectedShow(null); setSeats(1); setBooked(false); setError(null) }}>
                        <option value="">--- Select a City ---</option>
                        {cities.map(c => (
                            <option value={c} key={c}>{c}</option>
                        ))}
                    </select>
                </>
            )}
            {selectedCity && (
                <>
                    <h3>Theatres in {selectedCity}</h3>
                    {theatresInCity.length == 0 && <p>No shows available</p>}
                    <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                        <option value="">--- Select a Theatre ---</option>
                        {theatresInCity.map(t => (
                            <option value={t._id} key={t._id}>{t.theatre_name}</option>
                        ))}
                    </select>
                    {selectedTheatre && (
                        <>
                            <h3>Shows</h3>
                            {shows.length == 0 && <p>No shows available</p>}
                            <select value={selectedShow} onChange={(e) => setSelectedShow(e.target.value)}>
                                <option value="">--- Select a Show ---</option>
                                {shows.map(s => (
                                    <option value={s._id} key={s._id}>{new Date(s.date).toLocaleDateString()} at {s.time} ({s.seatsAvailable} seat(s) left)</option>
                                ))}
                            </select>
                            {selectedShow && (
                                <>
                                    <p>Price: ₹{selectedShowObj?.price}</p>
                                    <label>Number of seats:</label>
                                    <input type="number" value={seats} min="1" max={selectedShowObj?.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
                                    <p>Total cost: ₹{selectedShowObj?.price * seats} </p>
                                    <button className="book-btn" onClick={() => navigate('/booking-summary', {
                                        state: { event: selectedShowObj, eventType: 'Show', seatsBooked: seats, seatsSelected: '' }
                                    })}>Proceed to booking</button>
                                </>
                            )}
                        </>
                    )}
                    {error && <p className="error">{error}</p>}
                </>
            )}
        </div>
    )
}

export default BookMovie