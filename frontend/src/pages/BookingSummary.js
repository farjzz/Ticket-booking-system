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
            <h3>Booking Summary</h3>
            {eventType == 'Show' && movieDetails && theatreDetails && (
                <>
                    <p><em>Movie: </em>{movieDetails.name}</p>
                    <p><em>Genre: </em>{movieDetails.genre}</p>
                    <p><em>Theatre: </em>{theatreDetails.theatre_name}, {theatreDetails.location}</p>
                    <p><em>Date: </em>{new Date(event.date).toDateString()}</p>
                    <p><em>Time: </em>{event.time}</p>
                    <p><em>Price per ticket: </em>₹{event.price}</p>
                    <p><em>Number of seats booked: </em>{seatsBooked}</p>
                    <p><em>Total price: </em>₹{event.price * seatsBooked}</p>
                </>
            )}
            {eventType == 'Concert' && (
                <>
                    <p><em>Concert: </em>{event.name}</p>
                    <p><em>Genre: </em>{event.genre}</p>
                    <p><em>Artist(s): </em>{event.artist}</p>
                    <p><em>Date: </em>{new Date(event.date).toDateString()}</p>
                    <p><em>Time: </em>{event.time}</p>
                    <p><em>Venue: </em>{event.venue}, {event.location}</p>
                    <p><em>Price per ticket: </em>₹{event.price}</p>
                    <p><em>Number of seats booked: </em>{seatsBooked}</p>
                    <p><em>Total price: </em>₹{event.price * seatsBooked}</p>
                </>
            )}
            {eventType == 'TrainClass' && trainDetails && (
                <>
                    <p><strong>{trainDetails.number} {trainDetails.name}</strong></p>
                    <p><em>Source: </em>{trainDetails.source}</p>
                    <p><em>Destination: </em>{trainDetails.destination}</p>
                    <p><em>Departure Date: </em>{new Date(trainDetails.departureDate).toDateString()}</p>
                    <p><em>Departure Time: </em>{trainDetails.departureTime}</p>
                    <p><em>Arrival Date: </em>{new Date(trainDetails.arrivalDate).toDateString()}</p>
                    <p><em>Arrival Time: </em>{trainDetails.arrivalTime}</p>
                    <p><em>Class: </em>{event.classType}</p>
                    <p><em>Price per ticket: </em>₹{event.price}</p>
                    <p><em>Number of seats booked: </em>{seatsBooked}</p>
                    <p><em>Total price: </em>₹{event.price * seatsBooked}</p>
                </>
            )}
            <button onClick={handleBooking} disabled={isBooking} className="book-btn">{isBooking ? 'Booking...' : 'Confirm Booking'}</button>
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
