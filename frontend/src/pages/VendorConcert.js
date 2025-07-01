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
            }, 1000)
        } catch (error) {
            setError(error.message)
        }
    }
    return (<div className="concert-detailss">
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {concert && (
            <div className="concert">
                <img src={concert.poster} alt="concert-poster" />
                <div className="concert-txt">
                    <h3>{concert.name}</h3>
                    <p><em>Artist:</em> {concert.artist}</p>
                    <p><em>Genre:</em> {concert.genre}</p>
                    <p><em>Date:</em> {new Date(concert.date).toLocaleDateString()}</p>
                    <p><em>Time:</em> {concert.time}</p>
                    <p><em>Venue:</em> {concert.venue}, {concert.location}</p>
                    <p><em>Price:</em> ₹{concert.price}</p>
                    <p><em>Total seats:</em> {concert.seatsTotal}</p>
                    <p><em>Seats booked:</em> {concert.seatsTotal - concert.seatsAvailable}</p>
                    <p><em>Seats left:</em> {concert.seatsAvailable}</p>
                    <button onClick={() => deleteConcert()} className="btn">Delete Concert</button>
                    {deleted && <p>Concert deleted!</p>}
                </div>
            </div>
        )}
    </div>)
}

export default VendorConcert