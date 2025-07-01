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
            }, 1000)
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
            setClasses(prev => prev.filter(c => c._id != classId))
        } catch (error) {
            setError(error.message)
        }
    }
    return (<div>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        <div className="trainn">
            {train && (
                <div className="train">
                    <h4>{train.number}</h4>
                    <h3>{train.name}</h3>
                    <p><em>Source:</em> {train.source}</p>
                    <p><em>Destination:</em> {train.destination}</p>
                    <p><em>Departure Date:</em> {new Date(train.departureDate).toLocaleDateString()}</p>
                    <p><em>Departure Time:</em> {train.departureTime}</p>
                    <p><em>Arrival Date:</em> {new Date(train.arrivalDate).toLocaleDateString()}</p>
                    <p><em>Arrival Time:</em> {train.arrivalTime}</p>
                    <button onClick={() => deleteTrain()} className="train-btn">Delete Train</button>
                    {deleted && <p>Train deleted!</p>}
                </div>
            )}
            <div className="class-list">
                <h3>Available Classes</h3>
                <div className="classes">
                    {!isLoading && classes.map(c => (
                        <div className="class">
                            <span onClick={() => deleteClass(c._id)} className="material-symbols-outlined del-icon train-del">delete</span>
                            <h4>{c.classType}</h4>
                            <p><em>Price:</em> ₹{c.price}</p>
                            <p><em>Total Seats:</em> {c.seatsTotal}</p>
                            <p><em>Seats Booked:</em> {c.seatsTotal - c.seatsAvailable}</p>
                            <p><em>Seats Left:</em> {c.seatsAvailable}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>)
}

export default VendorTrain