import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const BookingSummary = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [isBooking, setIsBooking] = useState(false)
    const [booked, setBooked] = useState(false)
    const [trainDetails, setTrainDetails] = useState(null)
    const [movieDetails, setMovieDetails] = useState(null)
    const [theatreDetails, setTheatreDetails] = useState(null)
    const { event, eventType, seatsBooked, seatsSelected } = state
    useEffect(() => {
        const fetchDetails = async () => {
            if (eventType == 'TrainClass') {
                try {
                    const response = await fetch(`/api/trains/${event.train}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    if (!response.ok) {
                        throw Error(json.error)
                    }
                    setTrainDetails(json)
                } catch (error) {
                    setError(error.message)
                }
            }
            if (eventType == 'Show') {
                try {
                    const response = await fetch(`/api/movies/${event.movie}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    if (!response.ok) {
                        throw Error(json.error)
                    }
                    setMovieDetails(json)
                } catch (error) {
                    setError(error.message)
                }
            }
            if (eventType == 'Show') {
                try {
                    const response = await fetch(`/api/theatres/${event.theatre}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    if (!response.ok) {
                        throw Error(json.error)
                    }
                    setTheatreDetails(json)
                } catch (error) {
                    setError(error.message)
                }
            }
        }
        fetchDetails()
    }, [event, eventType])
    const handleBooking = async () => {
        setError(null)
        if (!user) {
            setError("You must be logged in") //redirect to login page from app.js later
            return
        }
        if (event.seatsAvailable < seatsBooked) {
            setError("Not enough seats available")
            return
        }
        setIsBooking(true)
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    eventType,
                    eventId: event._id,
                    seatsBooked,
                    seatsSelected
                })
            })
            const json = await response.json()
            if (!response.ok) {
                setIsBooking(false)
                setError(json.error)
                return
            }
            if (response.ok) {
                setError(null)
                setBooked(true)
            }
        } catch (error) {
            setError(error.message)
        }
        setIsBooking(false)
    }
    return (
        <div className="booking-summary">
            <h2>Booking Summary</h2>
            {eventType == 'Show' && movieDetails && theatreDetails && (
                <>
                    <p><strong>Movie:</strong>{movieDetails.name}</p>
                    <p><strong>Genre:</strong>{movieDetails.genre}</p>
                    <p><strong>Theatre:</strong>{theatreDetails.theatre_name}, {theatreDetails.location}</p>
                    <p><strong>Date:</strong>{new Date(event.date).toDateString()}</p>
                    <p><strong>Time:</strong>{event.time}</p>
                    <p><strong>Price per ticket:</strong>{event.price}</p>
                    <p><strong>Number of seats booked:</strong>{seatsBooked}</p>
                    <p><strong>Total price:</strong>{event.price * seatsBooked}</p>
                </>
            )}
            {eventType == 'Concert' && (
                <>
                    <p><strong>Concert:</strong>{event.name}</p>
                    <p><strong>Genre:</strong>{event.genre}</p>
                    <p><strong>Artist(s):</strong>{event.artist}</p>
                    <p><strong>Date:</strong>{new Date(event.date).toDateString()}</p>
                    <p><strong>Time:</strong>{event.time}</p>
                    <p><strong>Venue:</strong>{event.venue}, {event.location}</p>
                    <p><strong>Price per ticket:</strong>{event.price}</p>
                    <p><strong>Number of seats booked:</strong>{seatsBooked}</p>
                    <p><strong>Total price:</strong>{event.price * seatsBooked}</p>
                </>
            )}
            {eventType == 'TrainClass' && trainDetails && (
                <>
                    <p><strong>{trainDetails.number} {trainDetails.name}</strong></p>
                    <p><strong>Source:</strong>{trainDetails.source}</p>
                    <p><strong>Destination:</strong>{trainDetails.destination}</p>
                    <p><strong>Departure Date:</strong>{new Date(trainDetails.departureDate).toDateString()}</p>
                    <p><strong>Departure Time:</strong>{trainDetails.departureTime}</p>
                    <p><strong>Arrival Date:</strong>{new Date(trainDetails.arrivalDate).toDateString()}</p>
                    <p><strong>Arrival Time:</strong>{trainDetails.arrivalTime}</p>
                    <p><strong>Class:</strong>{event.classType}</p>
                    <p><strong>Price per ticket:</strong>{event.price}</p>
                    <p><strong>Number of seats booked:</strong>{seatsBooked}</p>
                    <p><strong>Total price:</strong>{event.price * seatsBooked}</p>
                </>
            )}
            <button onClick={handleBooking} disabled={isBooking}>{isBooking ? 'Booking...' : 'Confirm Booking'}</button>
            {error && <p className="error">{error}</p>}
            {booked && (
                <>
                    <p>Booking was successful!</p>
                    <Link to='/'>Go to home page</Link>
                </>
            )}
        </div>
    )
}

export default BookingSummary
