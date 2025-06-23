import { useState } from "react";
import { FaFilter } from 'react-icons/fa'

const EventFilter = ({ selectedCategory, setSelectedCategory }) => {
    const [filters, setFilters] = useState(false)
    const handleClick = (c) => {
        setSelectedCategory(c)
        setFilters(false)
    }
    return (
        <div className="event-filter">
            <div className="filter">
                <FaFilter className="filter-icon" onClick={() => setFilters(prev => !prev)} />
            </div>
            {filters && (
                <div className="filter-dropdown">
                    <p onClick={() => handleClick('movie')}>Movies</p>
                    <p onClick={() => handleClick('concert')}>Concerts</p>
                    <p onClick={() => handleClick('train')}>Trains</p>
                </div>
            )}
            <div className="categories">
                <span className={selectedCategory == 'movie' ? 'active' : ''} onClick={() => handleClick('movie')}>
                    Movies
                </span>
                <span className={selectedCategory == 'concert' ? 'active' : ''} onClick={() => handleClick('concert')}>
                    Concerts
                </span>
                <span className={selectedCategory == 'train' ? 'active' : ''} onClick={() => handleClick('train')}>
                    Trains
                </span>
            </div>
        </div>
    )
}

export default EventFilter