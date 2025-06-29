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
            <h3>Booking Details</h3>
            {b.eventType == 'Show' && (
                <div>
                    <p><em>Movie: </em>{b.eventId.movie.name}</p>
                    <p><em>Genre: </em>{b.eventId.movie.genre}</p>
                    <p><em>Theatre: </em>{b.eventId.theatre.theatre_name}, {b.eventId.theatre.location}</p>
                    <p><em>Date: </em>{new Date(b.eventId.date).toDateString()}</p>
                    <p><em>Time: </em>{b.eventId.time}</p>
                    <p><em>Price per ticket: </em>₹{b.eventId.price}</p>
                    <p><em>Number of seats booked: </em>{b.seatsBooked}</p>
                    <p><em>Total price: </em>₹{b.eventId.price * b.seatsBooked}</p>
                </div>
            )}
            {b.eventType == 'Concert' && (
                <div>
                    <p><em>Concert: </em>{b.eventId.name}</p>
                    <p><em>Genre: </em>{b.eventId.genre}</p>
                    <p><em>Artist(s): </em>{b.eventId.artist}</p>
                    <p><em>Date: </em>{new Date(b.eventId.date).toDateString()}</p>
                    <p><em>Time: </em>{b.eventId.time}</p>
                    <p><em>Venue: </em>{b.eventId.venue}, {b.eventId.location}</p>
                    <p><em>Price per ticket: </em>₹{b.eventId.price}</p>
                    <p><em>Number of seats booked: </em>{b.seatsBooked}</p>
                    <p><em>Total price: </em>₹{b.eventId.price * b.seatsBooked}</p>
                </div>
            )}
            {b.eventType == 'TrainClass' && (
                <div>
                    <p><strong>{b.eventId.train.number} {b.eventId.train.name}</strong></p>
                    <p><em>Source: </em>{b.eventId.train.source}</p>
                    <p><em>Destination: </em>{b.eventId.train.destination}</p>
                    <p><em>Departure Date: </em>{new Date(b.eventId.train.departureDate).toDateString()}</p>
                    <p><em>Departure Time: </em>{b.eventId.train.departureTime}</p>
                    <p><em>Arrival Date: </em>{new Date(b.eventId.train.arrivalDate).toDateString()}</p>
                    <p><em>Arrival Time: </em>{b.eventId.train.arrivalTime}</p>
                    <p><em>Class: </em>{b.eventId.classType}</p>
                    <p><em>Price per ticket: </em>₹{b.eventId.price}</p>
                    <p><em>Number of seats booked: </em>{b.seatsBooked}</p>
                    <p><em>Total price: </em>₹{b.eventId.price * b.seatsBooked}</p>
                </div>
            )}
            <button onClick={() => cancelBooking(b._id)} disabled={isLoading} className="cancel-btn">{isLoading ? 'Cancelling...' : 'Cancel Booking'}</button>
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
