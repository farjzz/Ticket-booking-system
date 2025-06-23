import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event._id}`} className='event-link'>
            <div className="event-card">
                {event.eventType == 'movie' && (
                    <div className="movie-card">
                        <img src="{`/uploads/${event.poster}`}" alt="movie-poster" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.genre}</p>
                            <p>{event.language}</p>
                        </div>
                    </div>
                )}
                {event.eventType == 'concert' && (
                    <div className="concert-card">
                        <img src="{`/uploads/${event.poster}`}" alt="concert-poster" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.artist}</p>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.venue}, {event.location}</p>
                        </div>
                    </div>
                )}
                {event.eventType == 'train' && (
                    <div className="train-card">
                        <div className="train-left">
                            <p>{event.number}</p>
                            <h3>{event.name}</h3>
                        </div>
                        <div className="train-right">
                            <div className="src">
                                <span>{event.departureDate}</span>
                                <span>{event.departureTime}</span>
                                <p>{event.source}</p>
                            </div>
                            <div className="dest">
                                <span>{event.arrivalDate}</span>
                                <span>{event.arrivalTime}</span>
                                <p>{event.destination}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default EventCard