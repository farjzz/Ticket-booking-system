import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const VendorTrain = () => {
    const { id } = useParams()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const [train, setTrain] = useState(null)
    const [classes, setClasses] = useState([])
    const [deleted, setDeleted] = useState(false) //over-rides for trains and classes - isloading as well - in moveis as well
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchTrain = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/trains/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setTrain(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchTrain()
    }, [id, user])
    useEffect(() => {
        if (!user) return
        const fetchClass = async () => {
            try {
                const response = await fetch(`/api/class?train=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    throw Error(json.error)
                }
                setClasses(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        fetchClass()
    }, [id, user])
    const deleteTrain = async () => {
        try {
            const response = await fetch(`/api/trains/${id}`, {
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
    const deleteClass = async (classId) => {
        try {
            const response = await fetch(`/api/class/${classId}`, {
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
    return (<div className="train-details">
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {train && (
            <div className="train">
                <h3>{train.number} {train.name}</h3>
                <p>Source: {train.source}</p>
                <p>Destination: {train.destination}</p>
                <p>Departure Date: {new Date(train.departureDate).toLocaleDateString()}</p>
                <p>Departure Time: {train.departureTime}</p>
                <p>Arrival Date: {new Date(train.arrivalDate).toLocaleDateString()}</p>
                <p>Arrival Time: {train.arrivalTime}</p>
                <button onClick={() => deleteTrain}>Delete Train</button>
                {deleted && <p>Train deleted!</p>}
            </div>
        )}
        {!isLoading && classes.map(c => (
            <div className="classes">
                <h3>{c.classType}</h3>
                <p>Price: ₹{c.price}</p>
                <p>Total Seats: {c.seatsTotal}</p>
                <p>Seats Booked: {c.seatsTotal - c.seatsAvailable}</p>
                <p>Seats Left: {c.seatsAvailable}</p>
                <button onClick={() => deleteClass(c._id)}>Delete Class</button>
            </div>
        ))}
    </div>)
}

export default VendorTrain