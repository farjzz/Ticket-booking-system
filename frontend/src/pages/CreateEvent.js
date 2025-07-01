import { useState } from "react"
import CreateClassForm from "./CreateClassForm"
import CreateConcertForm from "./CreateConcertForm"
import CreateMovieForm from "./CreateMovieForm"
import CreateShowForm from "./CreateShowForm"
import CreateTheatreForm from "./CreateTheatreForm"
import CreateTrainForm from "./CreateTrainForm"

const CreateEvent = () => {
    const [eventType, setEventType] = useState(null)
    return (
        <div className="new-event">
            <label>Event Type</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="">--- Select Event Type ---</option>
                <option value="movie" >Add a new Movie</option>
                <option value="concert" >Add a new Concert</option>
                <option value="train" >Add a new Train</option>
                <option value="theatre" >Add a new Theatre</option>
                <option value="show">Add a new Show</option>
                <option value="class">Add a new Class to a Train</option>
            </select>
            {eventType == 'movie' && <CreateMovieForm />}
            {eventType == 'concert' && <CreateConcertForm />}
            {eventType == 'train' && <CreateTrainForm />}
            {eventType == 'theatre' && <CreateTheatreForm />}
            {eventType == 'show' && <CreateShowForm />}
            {eventType == 'class' && <CreateClassForm />}
        </div>
    )
}

export default CreateEvent