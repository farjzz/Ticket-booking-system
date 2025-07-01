import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const CreateClassForm = () => {
    const { user } = useAuthContext()
    const [trains, setTrains] = useState([])
    const [selectedTrain, setSelectedTrain] = useState(null)
    const [classType, setClassType] = useState('')
    const [price, setPrice] = useState('')
    const [seatsTotal, setSeatsTotal] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    //gotta list trains first and then this
    useEffect(() => {
        const fetchTrains = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/vendor?type=Train', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
                if (!response.ok) {
                    setIsLoading(false)
                    throw Error(json.error)
                }
                setTrains(json)
            } catch (error) {
                setError(error.message)
            }
            setIsLoading(false)
        }
        if (user.role == 'vendor') fetchTrains()
    }, [user])
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        try {
            const response = await fetch('/api/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ classType, price: Number(price), seatsTotal: Number(seatsTotal), seatsAvailable: Number(seatsTotal), train: selectedTrain })
            })
            const json = await response.json()
            if (!response.ok) {
                throw Error(json.error)
            }
            setSuccess(true)
            setClassType('')
            setSeatsTotal('')
            setPrice('')
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <form onSubmit={handleSubmit} className="create-class">
            {trains.length == 0 && <p>No trains available</p>}
            <select value={selectedTrain} onChange={(e) => setSelectedTrain(e.target.value)}>
                <option value="">--- Select a Train ---</option>
                {trains.map(t => (
                    <option value={t._id} key={t._id}>{t.name}</option>
                ))}
            </select>
            {selectedTrain && (
                <div className="create-event">
                    <h2>Add a New Class</h2>
                    <div className="entry">
                        <label>Class Type:</label>
                        <input type="text" value={classType} onChange={(e) => setClassType(e.target.value)} required />
                    </div>
                    <div className="entry">
                        <label>Price (in rupees):</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="entry">
                        <label>Total seats:</label>
                        <input type="number" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn">Create Class</button>
                    {success && (
                        <>
                            <p className="success">Class was created successfully!</p>
                            <Link to='/vendor'>Go to dashboard</Link>
                        </>
                    )}
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </form>
    )
}
export default CreateClassForm