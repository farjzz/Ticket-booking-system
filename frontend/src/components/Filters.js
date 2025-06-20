import { useState } from "react";
import { FaFilter } from 'react-icons-fa'

const eventFilter = ({ selectedCategory, setSelectedCategory }) => {
    const [filters, setFilters] = useState(false)
    return (
        <div className="event-filter">
            <div className="filter">
                <FaFilter className="filter-icon" />
            </div>
        </div>
    )
}