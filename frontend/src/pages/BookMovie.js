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
    const { user } = useAuthContext()
    useEffect(() => {
        if (!user) {
            setError('You must be logged in to book tickets')
            setIsLoading(false)
        }
    }, [user])
    useEffect(() => {
        setSelectedShow(null)
        setSeats(1)
        const fetchShows = async () => {
            if (!selectedTheatre) return
            try {
                const response = await fetch(`/api/shows?theatre=${selectedTheatre}`, {
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
    }, [selectedTheatre])
    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await fetch(`/api/theatres?movie=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setTheatres(json)
                const citiesUnique = [...new Set(json.map(t => t.location))]
                setCities(citiesUnique)
                setIsLoading(false)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchTheatres()
    }, [id])
    useEffect(() => {
        setSelectedTheatre(null)
        setSelectedShow(null)
        setSeats(1)
    }, [selectedCity])
    const handleBooking = () => {
        if (!selectedShowObj) {
            setError("Please select a show")
            return
        }
        if (selectedShowObj.seatsAvailable < seats) {
            setError("Not enough seats available")
            return
        }
        //rest of the code for booking logic
    }
    const theatresInCity = selectedCity ? theatres.filter(t => t.location == selectedCity) : []
    const selectedTheatreObj = theatres.find(t => t._id == selectedTheatre)
    const selectedShowObj = shows.find(s => s._id == selectedShow)
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    return (
        <div className="movie-booking">
            <h3>Select City</h3>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
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
                            <p>Price: ₹{selectedTheatreObj.price}</p>
                            <h4>Shows</h4>
                            {shows.length == 0 && <p>No shows available</p>}
                            <select value={selectedShow} onChange={(e) => setSelectedShow(e.target.value)}>
                                <option value="">--- Choose a Show ---</option>
                                {shows.map(s => (
                                    <option value={s._id} key={s._id}>{new Date(s.date).toLocaleDateString()} at {s.time} ({s.seatsAvailable} seat(s) left)</option>
                                ))}
                            </select>
                            <label>Number of seats:</label>
                            <input type="number" value={seats} min="1" max={selectedShowObj?.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
                        </>
                    )}
                    {error && <p className="error">{error}</p>}
                    <button onClick={handleBooking} disabled={!selectedShow}>Book now</button>
                </>
            )}
        </div>
    )
}

export default BookMovie