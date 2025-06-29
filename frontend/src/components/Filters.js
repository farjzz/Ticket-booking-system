const EventFilter = ({ selectedCategory, setSelectedCategory }) => {
    const handleClick = (c) => {
        setSelectedCategory(c)
    }
    return (
        <div className="event-filter">
            <div className="categories">
                <span className={selectedCategory == 'Show' ? 'active' : ''} onClick={() => handleClick('Show')}>
                    Movies
                </span>
                <span className={selectedCategory == 'Concert' ? 'active' : ''} onClick={() => handleClick('Concert')}>
                    Concerts
                </span>
                <span className={selectedCategory == 'TrainClass' ? 'active' : ''} onClick={() => handleClick('TrainClass')}>
                    Trains
                </span>
            </div>
            <button onClick={() => handleClick('')} className="filters-btn" disabled={!selectedCategory}>Clear filters</button>
        </div>
    )
}

export default EventFilter