import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event._id}`} className='event-link'>
            <div className="event-card">
                {event.eventType == 'Show' && (
                    <div className="movie-card">
                        <img src={`/uploads/${event.poster}`} alt="movie-poster" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.genre}</p>
                            <p>{event.language}</p>
                        </div>
                    </div>
                )}
                {event.eventType == 'Concert' && (
                    <div className="concert-card">
                        <img src={`/uploads/${event.poster}`} alt="concert-poster" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.artist}</p>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.venue}, {event.location}</p>
                        </div>
                    </div>
                )}
                {event.eventType == 'TrainClass' && (
                    <div className="train-card">
                        <div className="train-left">
                            <p>{event.number}</p>
                            <h3>{event.name}</h3>
                        </div>
                        <div className="train-right">
                            <p>From:</p>
                            <div className="src">
                                <p><strong>{event.source}</strong></p>
                                <p>{event.departureDate.slice(0, 10)}</p>
                                <p>{event.departureTime}</p>
                            </div>
                            <p>To:</p>
                            <div className="dest">
                                <p><strong>{event.destination}</strong></p>
                                <p>{event.arrivalDate.slice(0, 10)}</p>
                                <p>{event.arrivalTime}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default EventCard