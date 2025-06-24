import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'

const BookMovie = () => {
    const { id } = useParams()
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
    const handleBooking = async () => {
        setIsBooking(true)
        setError(null)
        if (!selectedShow) {
            setError("Please select a show")
            return
        }
        if (selectedShowObj?.seatsAvailable < seats) {
            setError("Not enough seats available")
            return
        }
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    eventType: 'movie',
                    eventId: selectedShow,
                    seatsBooked: seats
                })
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            if (response.ok) {
                setBooked(true)
                setSelectedCity(null)
                setSelectedShow(null)
                setSelectedTheatre(null)
                setSeats(1)
                setError(null)
            }
        } catch (error) {
            setError(error.message)
        }
        setIsBooking(false)
    }
    const theatresInCity = selectedCity ? theatres.filter(t => t.location == selectedCity) : []
    const selectedTheatreObj = theatres.find(t => t._id == selectedTheatre)
    const selectedShowObj = shows.find(s => s._id == selectedShow)
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    return (
        <div className="movie-booking">
            <h3>Select City</h3>
            <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedTheatre(null); setSelectedShow(null); setSeats(1); setBooked(false); setError(null) }}>
                <option value="">--- Choose a City ---</option>
                {cities.map(c => (
                    <option value={c} key={c}>{c}</option>
                ))}
            </select>
            {selectedCity && (
                <>
                    <h4>Theatres in {selectedCity}</h4>
                    {theatresInCity.length == 0 && <p>No shows available</p>}
                    <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)}>
                        <option value="">--- Choose a Theatre ---</option>
                        {theatresInCity.map(t => (
                            <option value={t._id} key={t._id}>{t.theatre_name}</option>
                        ))}
                    </select>
                    {selectedTheatre && (
                        <>
                            <h4>Shows</h4>
                            {shows.length == 0 && <p>No shows available</p>}
                            <select value={selectedShow} onChange={(e) => setSelectedShow(e.target.value)}>
                                <option value="">--- Choose a Show ---</option>
                                {shows.map(s => (
                                    <option value={s._id} key={s._id}>{new Date(s.date).toLocaleDateString()} at {s.time} ({s.seatsAvailable} seat(s) left)</option>
                                ))}
                            </select>
                            <p>Price: ₹{selectedShowObj?.price}</p>
                            <label>Number of seats:</label>
                            <input type="number" value={seats} min="1" max={selectedShowObj?.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
                            <button onClick={handleBooking} disabled={!selectedShow || booked || isBooking}>{isBooking ? "Booking..." : "Book now"}</button>
                        </>
                    )}
                    {error && <p className="error">{error}</p>}
                    {booked && <p className="booked">Booking successful!</p>}
                </>
            )}
        </div>
    )
}

export default BookMovie