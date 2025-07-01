import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Event = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useAuthContext()
    const [event, setEvent] = useState(null)
    const [error, setError] = useState(null)
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
                    <img src={event.poster} alt={event.name} />
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
                <div className="concert-details">
                    <img src={event.poster} alt={event.name} />
                    <div className="details">
                        <h2>{event.name}</h2>
                        <p><em>On:</em> {new Date(event.date).toDateString()}</p>
                        <p><em>At:</em> {event.time}</p>
                        <p><em>Artist:</em> {event.artist}</p>
                        <p><em>Genre:</em> {event.genre}</p>
                        <p><em>Venue:</em> {event.venue}, {event.location}</p>
                        <p><em>Seats left:</em> {event.seatsAvailable}</p>
                        <p><em>Price:</em> ₹{event.price}</p>
                        <p><em>Description:</em> {event.description}</p>
                        <button className="book-btn" onClick={() => navigate(`/bookconcert/${event._id}`, {
                            state: { event }
                        })}>Proceed to booking</button>
                    </div>
                </div>
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