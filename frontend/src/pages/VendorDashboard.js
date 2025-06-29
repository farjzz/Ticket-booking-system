import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import VendorEventFilter from '../components/VendorFilters'
import VendorEventCard from "../components/VendorEventCard"
import { Link } from "react-router-dom";

const VendorDashboard = () => {
    const [events, setEvents] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isLoading, setIsLoading] = useState(false) //check initial state
    const [error, setError] = useState(null)
    const { user } = useAuthContext()
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
            const url = selectedCategory ? `/api/vendor?type=${selectedCategory}` : '/api/vendor'
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    setIsLoading(false)
                    throw Error(json.error)
                }
                setEvents(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        if (user.role == 'vendor') fetchEvents()
    }, [selectedCategory, user])
    return (
        <div className="home">
            {user.role != 'vendor' && (
                <p>Access denied.</p>
            )}
            {user.role == 'vendor' && (
                <>
                    <VendorEventFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    <Link to='/create-event'>
                        <button>Create New Event</button>
                    </Link>
                    <div className="events-list">
                        {isLoading && <p>Loading events...</p>}
                        {error && <p className="error">{error}</p>}
                        {!isLoading && !error && events.length === 0 && <p>No events created yet.</p>}
                        {events.map(e => (
                            <VendorEventCard event={e} key={e._id} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default VendorDashboard