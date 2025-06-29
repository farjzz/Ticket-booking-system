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
        if (!user) {
            setError('You must be logged in to view your bookings')
            setIsLoading(false)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [user])
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
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    if (bookings?.length == 0) {
        if (user.role == 'user') return <p>You have no bookings yet.</p>
        else return <p>You have no Bookings. Login as a user to book tickets.</p>
    }
    return (
        <div className="bookings-pg">
            <h2>Your bookings</h2>
            <div className="bookings">
                {bookings.map(b => (
                    b.eventId ? (
                        <div className="booking-card" onClick={() => navigate('/view-booking', {
                            state: { b }
                        })}>
                            {b.eventType == 'Show' && <strong>{b.eventId.movie.name}</strong>}
                            {b.eventType == 'Concert' && <strong>{b.eventId.name}</strong>}
                            {b.eventType == 'TrainClass' && <strong>{b.eventId.train.name}</strong>}
                            <p>{b.seatsBooked} seat(s) booked</p>
                            <p>Booked on {new Date(b.createdAt).toDateString()}</p>
                        </div>
                    ) : (
                        <div key={b._id}>
                            <p>Booking unavailable</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}
export default Bookings