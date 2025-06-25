import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

const Bookings = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(null)
    const [bookings, setBookings] = useState([])
    const [error, setError] = useState(null)
    const [cancelledIds, setCancelledIds] = useState(new Set())
    const { user } = useAuthContext()
    useEffect(() => {
        if (!user) return
        const fetchBookings = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch('/api/booking', {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setBookings(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchBookings()
    }, [user])
    const cancelBooking = async (bookingId) => {
        try {
            const response = await fetch(`/api/booking/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setBookings(prev => prev.filter(b => b._id != bookingId))
            setCancelledIds(prev => new Set(prev).add(bookingId))
        } catch (error) {
            setError(error.message)
        }
    }
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    if (bookings?.length == 0) return <p>You have no bookings yet.</p>
    return (
        <div className="bookings">
            <h2>Your bookings</h2>
            {bookings.map(b => (
                b.eventId ? (
                    <div key={b._id} className="a-booking">
                        {/* <Link to={`/booking-summary`}> */}
                        <div className="booking-card" onClick={() => navigate('/view-booking', {
                            state: { b }
                        })}>
                            {b.eventType == 'Show' && <p>{b.eventId.movie.name}</p>}
                            {b.eventType == 'Concert' && <p>{b.eventId.name}</p>}
                            {b.eventType == 'TrainClass' && <p>{b.eventId.train.name}</p>}
                            <p>{b.seatsBooked} seat(s) booked</p>
                            <p>Booked on {new Date(b.createdAt).toDateString()}</p>
                        </div>
                        {/* </Link> */}
                        {cancelledIds.has(b._id) ? (
                            <p>Booking cancelled successfully!</p>
                        ) : (
                            <button onClick={() => cancelBooking(b._id)}>Cancel booking</button>
                        )}
                    </div>
                ) : (
                    <div key={b._id}>
                        <p>Booking unavailable</p>
                    </div>
                )
            ))}
        </div>
    )
}
export default Bookings