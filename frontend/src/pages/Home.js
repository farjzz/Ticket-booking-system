import { useState, useEffect } from "react";
import EventFilter from '../components/Filters'
import EventCard from "../components/EventCard";

const Home = () => {
    const [events, setEvents] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isLoading, setIsLoading] = useState(true) //check initial state
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/events')
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setEvents(json)
                setIsLoading(false)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [])
    const eventsFiltered = selectedCategory ? events.filter(e => e.eventType == selectedCategory) : events
    //some of these dont have a class name (loading, no events found)
    return (
        <div className="home">
            <EventFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <div className="events-list">
                {isLoading && <p>Loading events...</p>}
                {error && <p className="error">{error}</p>}
                {!isLoading && !error && eventsFiltered.length == 0 && <p>No events found</p>}
                {eventsFiltered.map(e => (
                    <EventCard event={e} key={e._id} />
                ))}
            </div>
        </div>
    )
}

export default Home