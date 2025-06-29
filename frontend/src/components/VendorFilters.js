import { useState } from "react";
import { FaFilter } from 'react-icons/fa'

const VendorEventFilter = ({ selectedCategory, setSelectedCategory }) => {
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
                    <p onClick={() => handleClick('Theatre')}>Theatres</p>
                    <p onClick={() => handleClick('Concert')}>Concerts</p>
                    <p onClick={() => handleClick('Train')}>Trains</p>
                </div>
            )}
            <div className="categories">
                <span className={selectedCategory == 'Theatre' ? 'active' : ''} onClick={() => handleClick('Theatre')}>
                    Theatres
                </span>
                <span className={selectedCategory == 'Concert' ? 'active' : ''} onClick={() => handleClick('Concert')}>
                    Concerts
                </span>
                <span className={selectedCategory == 'Train' ? 'active' : ''} onClick={() => handleClick('Train')}>
                    Trains
                </span>
            </div>
            {selectedCategory && <button onClick={() => handleClick('')}>Clear filters</button>}
        </div>
    )
}

export default VendorEventFilter