import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Event = () => {
    const { id } = useParams()
    const { user } = useAuthContext()
    const [event, setEvent] = useState(null)
    const [error, setError] = useState(null)
    const [seats, setSeats] = useState(1)
    const [trainClass, setTrainClass] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [booked, setBooked] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${id}`)
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setEvent(json)
                setIsLoading(false)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchEvent()
    }, [id])
    const handleBooking = async () => {
        setError(null)
        if (!user) {
            setError("You must be logged in") //redirect to login page from app.js later
            return
        }
        if (event.seatsAvailable < seats) {
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
                    eventType: 'Concert',
                    eventId: event._id,
                    seatsBooked: seats
                })
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            if (response.ok) {
                setBooked(true)
                setError(null)
            }
        } catch (error) {
            setError(error.message)
        }
        setIsBooking(false)
    }
    if (isLoading) return <div>Loading...</div>
    if (error) return <div className="error">{error}</div>
    if (!event) return <div className="error">Event not found</div>
    const hrs = Math.floor(event.durationInMins / 60)
    const mins = event.durationInMins % 60
    return (
        <div className="event-details-pg">
            {event.eventType == 'Show' && (
                <>
                    <img src={`/uploads/${event.poster}`} alt={event.name} />
                    <div className="details">
                        <h2>{event.name}</h2>
                        <p>
                            <span>{hrs && (`${hrs}h `)}</span>
                            <span>{`${mins}min`}</span>
                            <span>{event.genre}</span>
                        </p>
                        <p>{event.language}</p>
                    </div>
                    <Link to={`/bookmovie/${event._id}`}>
                        <button className="book-btn">Proceed to booking</button>
                    </Link>
                </>
            )}
            {event.eventType == 'Concert' && (
                <>
                    <img src={`/uploads/${event.poster}`} alt={event.name} />
                    <div className="details">
                        <h2>{event.name}</h2>
                        <p>{event.artist}</p>
                        <p>{event.genre}</p>
                        <p>{new Date(event.date).toLocaleDateString()} {event.time}</p>
                        <p>
                            <span>{hrs && (`${hrs}h `)}</span>
                            <span>{`${mins}min`}</span>
                        </p>
                        <p>{event.language}</p>
                        <p>{event.venue},{event.location}</p>
                        <p>Seats left: {event.seatsAvailable}</p>
                    </div>
                    <p>{event.description}</p>
                    <label>Number of seats:</label>
                    <input type="number" value={seats} min="1" max={event.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
                    {/* <Link to="/booking-summary">
                        <button>Proceed to booking</button>
                    </Link> */}
                    <button className="book-btn" onClick={handleBooking} disabled={isBooking}>{isBooking ? "Booking..." : "Book now"}</button>
                    {booked && <p className="booked">Booking successful!</p>}
                </>
            )}
            {event.eventType == 'TrainClass' && (
                <div className="details">
                    <p>{event.number}</p>
                    <h2>{event.name}</h2>
                    <p>Source: {event.source} {event.departureDate} {event.departureTime}</p>
                    <p>Destination: {event.destination} {event.arrivalDate} {event.arrivalTime}</p>
                    <p>{event.description}</p>
                    <Link to={`/booktrain/${event._id}`}>
                        <button className="book-btn">Proceed to booking</button>
                    </Link>
                </div>
            )}
        </div>
    )
}
export default Event