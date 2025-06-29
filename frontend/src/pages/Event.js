import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Event = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useAuthContext()
    const [event, setEvent] = useState(null)
    const [error, setError] = useState(null)
    const [seats, setSeats] = useState(1)
    const [trainClass, setTrainClass] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
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
    if (isLoading) return <div>Loading...</div>
    if (error) return <div className="error">{error}</div>
    if (!event) return <div className="error">Event not found</div>
    const hrs = Math.floor(event.durationInMins / 60)
    const mins = event.durationInMins % 60
    return (
        <div className="event-details-pg">
            {event.eventType == 'Show' && (
                <div className="movie-details">
                    <img src={`/uploads/${event.poster}`} alt={event.name} />
                    <div className="details">
                        <h2>{event.name}</h2>
                        <p>
                            <span>{hrs && (`${hrs}h `)} {`${mins}min`} · {event.genre}</span>
                        </p>
                        <p>{event.language}</p>
                        <Link to={`/bookmovie/${event._id}`}>
                            <button className="book-btn">Proceed to booking</button>
                        </Link>
                    </div>
                </div>
            )}
            {event.eventType == 'Concert' && (
                <>
                    <img src={`/uploads/${event.poster}`} alt={event.name} />
                    <div className="details">
                        <h2>{event.name}</h2>
                        <p>{event.artist} · {event.genre}</p>
                        <p>{new Date(event.date).toLocaleDateString()} {event.time}</p>
                        <p>{event.language}</p>
                        <p>{event.venue},{event.location}</p>
                        <p>Seats left: {event.seatsAvailable}</p>
                        <p>Price: ₹{event.price}</p>
                        <p>{event.description}</p>
                        <button className="book-btn" onClick={() => navigate(`/bookconcert/${event._id}`, {
                            state: { event }
                        })}>Proceed to booking</button>
                    </div>
                </>
            )}
            {event.eventType == 'TrainClass' && (
                <div className="train-details">
                    <div>
                        <p>{event.number}</p>
                        <h2>{event.name}</h2>
                        <p>{event.description}</p>
                    </div>
                    <div>
                        <p><em>Source:</em> {event.source}</p>
                        <p><em>Date of Departure:</em> {event.departureDate.slice(0, 10)}</p>
                        <p><em>Time of Departure:</em> {event.departureTime}</p>
                        <p><em>Destination:</em> {event.destination}</p>
                        <p><em>Date of Arrival:</em> {event.arrivalDate.slice(0, 10)}</p>
                        <p><em>Time of Arrival:</em> {event.arrivalTime}</p>
                    </div>
                    <div>
                        <Link to={`/booktrain/${event._id}`}>
                            <button className="book-btn">Proceed to booking</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Event