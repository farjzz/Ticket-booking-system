import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const VendorConcert = () => {
    const { id } = useParams()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const [concert, setConcert] = useState(null)
    const [deleted, setDeleted] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchConcert = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/concerts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setConcert(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchConcert()
    }, [id, user])
    const deleteConcert = async () => {
        try {
            const response = await fetch(`/api/concerts/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setDeleted(true)
            setTimeout(() => {
                navigate('/vendor')
            }, 2000)
        } catch (error) {
            setError(error.message)
        }
    }
    return (<div className="concert-details">
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {concert && (
            <div className="concert">
                <h3>{concert.name}</h3>
                <p>Artist(s): {concert.artist}</p>
                <p>Genre: {concert.genre}</p>
                <p>Date: {new Date(concert.date).toLocaleDateString()}</p>
                <p>Time: {concert.time}</p>
                <p>Venue: {concert.venue}, {concert.location}</p>
                <p>Price: ₹{concert.price}</p>
                <p>Total seats: {concert.seatsTotal}</p>
                <p>Seats booked: {concert.seatsTotal - concert.seatsAvailable}</p>
                <p>Seats left: {concert.seatsAvailable}</p>
                <button onClick={() => deleteConcert}>Delete Concert</button>
                {deleted && <p>Concert deleted!</p>}
            </div>
        )}
    </div>)
}

export default VendorConcert