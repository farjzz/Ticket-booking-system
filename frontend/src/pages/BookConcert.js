import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'

const BookConcert = () => {
    const { id } = useParams()
    const { state } = useLocation()
    const { event } = state
    const navigate = useNavigate()
    const [seats, setSeats] = useState(1)
    const [error, setError] = useState(null)
    const { user } = useAuthContext()
    useEffect(() => {
        if (!user) {
            setError('You must be logged in to book tickets')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [user])
    if (error) return <p className="error">{error}</p>
    return (
        <div className="concert-booking">
            <label>Number of seats:</label>
            <input type="number" value={seats} min="1" max={event.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
            <p>Total cost: ₹{event.price * seats} </p>
            <button className="book-btn" onClick={() => navigate('/booking-summary', {
                state: { event, eventType: 'Concert', seatsBooked: seats, seatsSelected: '' }
            })}>Proceed to booking</button>
        </div>
    )
}

export default BookConcert