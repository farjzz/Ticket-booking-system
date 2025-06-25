import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ViewBooking = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { b } = state
    if (!b) return <p className="error">Invalid booking</p>
    const cancelBooking = async (bookingId) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/booking/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                setIsLoading(false)
                throw Error(json.error)
            }
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
        setSuccess(true)
    }
    return (
        <div className="view-booking">
            <h2>Booking Details</h2>
            {b.eventType == 'Show' && (
                <>
                    <p><strong>Movie:</strong>{b.eventId.movie.name}</p>
                    <p><strong>Genre:</strong>{b.eventId.movie.genre}</p>
                    <p><strong>Theatre:</strong>{b.eventId.theatre.theatre_name}, {b.eventId.theatre.location}</p>
                    <p><strong>Date:</strong>{new Date(b.eventId.date).toDateString()}</p>
                    <p><strong>Time:</strong>{b.time}</p>
                    <p><strong>Price per ticket:</strong>{b.eventId.price}</p>
                    <p><strong>Number of seats booked:</strong>{b.seatsBooked}</p>
                    <p><strong>Total price:</strong>{b.eventId.price * b.seatsBooked}</p>
                </>
            )}
            {b.eventType == 'Concert' && (
                <>
                    <p><strong>Concert:</strong>{b.eventId.name}</p>
                    <p><strong>Genre:</strong>{b.eventId.genre}</p>
                    <p><strong>Artist(s):</strong>{b.eventId.artist}</p>
                    <p><strong>Date:</strong>{new Date(b.eventId.date).toDateString()}</p>
                    <p><strong>Time:</strong>{b.eventId.time}</p>
                    <p><strong>Venue:</strong>{b.eventId.venue}, {b.eventId.location}</p>
                    <p><strong>Price per ticket:</strong>{b.eventId.price}</p>
                    <p><strong>Number of seats booked:</strong>{b.seatsBooked}</p>
                    <p><strong>Total price:</strong>{b.eventId.price * b.seatsBooked}</p>
                </>
            )}
            {b.eventType == 'TrainClass' && (
                <>
                    <p><strong>{b.eventId.train.number} {b.eventId.train.name}</strong></p>
                    <p><strong>Source:</strong>{b.eventId.train.source}</p>
                    <p><strong>Destination:</strong>{b.eventId.train.destination}</p>
                    <p><strong>Departure Date:</strong>{new Date(b.eventId.train.departureDate).toDateString()}</p>
                    <p><strong>Departure Time:</strong>{b.eventId.train.departureTime}</p>
                    <p><strong>Arrival Date:</strong>{new Date(b.eventId.train.arrivalDate).toDateString()}</p>
                    <p><strong>Arrival Time:</strong>{b.eventId.train.arrivalTime}</p>
                    <p><strong>Class:</strong>{b.eventId.classType}</p>
                    <p><strong>Price per ticket:</strong>{b.eventId.price}</p>
                    <p><strong>Number of seats booked:</strong>{b.seatsBooked}</p>
                    <p><strong>Total price:</strong>{b.eventId.price * b.seatsBooked}</p>
                </>
            )}
            <button onClick={() => cancelBooking(b._id)} disabled={isLoading}>{isLoading ? 'Cancelling...' : 'Cancel Booking'}</button>
            {error && <p className="error">{error}</p>}
            {success && (
                <>
                    <p>Booking was cancelled!</p>
                    <Link to='/'>Go to home page</Link> {/*gotta redirect directly - after 2 seconds */}
                </>
            )}
        </div>
    )
}

export default ViewBooking
