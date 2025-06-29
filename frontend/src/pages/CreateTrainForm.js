import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const CreateTrainForm = () => {
    const { user } = useAuthContext()
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [source, setSource] = useState('')
    const [destination, setDestination] = useState('')
    const [departureDate, setDepartureDate] = useState('')
    const [departureTime, setDepartureTime] = useState('')
    const [arrivalDate, setArrivalDate] = useState('')
    const [arrivalTime, setArrivalTime] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/trains', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, number: Number(number), source, destination, departureDate, departureTime, arrivalDate, arrivalTime })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setName('')
            setNumber('')
            setSource('')
            setDestination('')
            setDepartureDate('')
            setDepartureTime('')
            setArrivalDate('')
            setArrivalTime('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Train</h2>
            <label>Train Number:</label>
            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
            <label>Train Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Source:</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} required />
            <label>Destination:</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            <label>Date of Departure:</label>
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
            <label>Time of Departure:</label>
            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
            <label>Date of Arrival:</label>
            <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
            <label>Time of Arrival:</label>
            <input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
            <button type="submit">Create Train</button>
            {error && <p className="error">{error}</p>}
            {success && (
                <>
                    <p className="success">Train was created successfully!</p>
                    <Link to='/vendor'>Go to dashboard</Link>
                </>
            )}
        </form>
    )
}
export default CreateTrainForm