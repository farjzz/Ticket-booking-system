import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {
    return (
        //<Link to={`/vendor-event/${event._id}`} className='event-link'>
        <div className="event-card">
            {event.eventType == 'Theatre' && (
                <Link to={`/vendor-theatre/${event._id}`}>
                    <div className="theatre-card">
                        <h3>{event.theatre_name}</h3>
                        <p>{event.location}</p>
                        <p>Total seats: {event.seatsTotal}</p>
                    </div>
                </Link>
            )}
            {event.eventType == 'Concert' && (
                <Link to={`/vendor-concert/${event._id}`}>
                    <div className="concert-card">
                        <img src="{`/uploads/${event.poster}`}" alt="concert-poster" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.artist}</p>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.venue}, {event.location}</p>
                        </div>
                    </div>
                </Link>
            )}
            {event.eventType == 'Train' && (
                <Link to={`/vendor-train/${event._id}`}>
                    <div className="train-card">
                        <div className="train-left">
                            <p>{event.number}</p>
                            <h3>{event.name}</h3>
                        </div>
                        <div className="train-right">
                            <div className="src">
                                <p>{event.departureDate.slice(0, 10)} at {event.departureTime}</p>
                                <p>{event.source}</p>
                            </div>
                            <div className="dest">
                                <p>{event.arrivalDate.slice(0, 10)} at {event.arrivalTime}</p>
                                <p>{event.destination}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </div>
        //</Link>
    )
}

export default EventCard