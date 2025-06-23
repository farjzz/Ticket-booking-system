import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Event = () => {
    const { id } = useParams()
    const { user } = useAuthContext()
    const [event, setEvent] = useState(null)
    const [error, setError] = useState(null)
    const [concertSeats, setConcertSeats] = useState(1)
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
            {event.eventType == 'movie' && (
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
                        <button className="book-btn">Book tickets</button>
                    </Link>
                </>
            )}
            {event.eventType == 'concert' && (
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
                    </div>
                    <p>{event.description}</p>
                    <label>Number of seats:</label>
                    <input type="number" value={concertSeats} min="1" max={event.seatsAvailable} onChange={(e) => setConcertSeats(Number(e.target.value))} />
                    <Link to={`/bookconcert/${event._id}`}>
                        <button className="book-btn">Book now</button>
                    </Link>
                </>
            )}
            {event.eventType == 'train' && (
                <div className="details">
                    <p>{event.number}</p>
                    <h2>{event.name}</h2>
                    <p>Source: {event.source} {event.departureDate} {event.departureTime}</p>
                    <p>Destination: {event.destination} {event.arrivalDate} {event.arrivalTime}</p>
                    <p>Class: {event.classType}</p>
                    <p>₹{event.price}</p>
                    <p>{event.description}</p>
                    <Link to={`/booktrain/${event._id}`}>
                        <button className="book-btn">Book now</button>
                    </Link>
                </div>
            )}
        </div>
    )
}
export default Event