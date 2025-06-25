import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext'

const BookTrain = () => {
    const { id } = useParams()
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)
    const [seats, setSeats] = useState(1)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [booked, setBooked] = useState(false)
    const [isBooking, setIsBooking] = useState(false)
    const { user } = useAuthContext()
    useEffect(() => {
        if (!user) {
            setError('You must be logged in to book tickets')
            setIsLoading(false)
        }
    }, [user])
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
                setIsLoading(false)
            } catch (error) {
                setError(error.message)
                setIsLoading(false)
            }
        }
        fetchClass()
    }, [id, user])
    const handleBooking = async () => {
        setIsBooking(true)
        setError(null)
        if (!selectedClass) {
            setError("Please select a class")
            return
        }
        if (selectedClassObj?.seatsAvailable < seats) {
            setError("Not enough seats available")
            return
        }
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    eventType: 'TrainClass',
                    eventId: selectedClass,
                    seatsBooked: seats
                })
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            if (response.ok) {
                setBooked(true)
                setSelectedClass(null)
                setSeats(1)
                setError(null)
            }
        } catch (error) {
            setError(error.message)
        }
        setIsBooking(false)
    }
    const selectedClassObj = classes.find(c => c._id == selectedClass)
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error">{error}</p>
    return (
        <div className="train-booking">
            <h4>Class Type</h4>
            {classes.length == 0 && <p>No class available</p>}
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSeats(1); setBooked(false); setError(null) }}>
                <option value="">--- Select a Class ---</option>
                {classes.map(c => (
                    <option value={c._id} key={c._id}>{c.classType} ({c.seatsAvailable} seat(s) left)</option>
                ))}
            </select>
            {selectedClass && (
                <>
                    <p>Price: ₹{selectedClassObj?.price}</p>
                    <label>Number of seats:</label>
                    <input type="number" value={seats} min="1" max={selectedClassObj?.seatsAvailable} onChange={(e) => setSeats(Number(e.target.value))} />
                </>
            )}
            {error && <p className="error">{error}</p>}
            <button onClick={handleBooking} disabled={!selectedClass || booked || isBooking}>{isBooking ? "Booking..." : "Book now"}</button>
            {booked && <p className="booked">Booking successful!</p>}
        </div>
    )
}

export default BookTrain