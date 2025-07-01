const VendorEventFilter = ({ selectedCategory, setSelectedCategory }) => {
    const handleClick = (c) => {
        setSelectedCategory(c)
    }
    return (
        <div className="event-filter">
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
                <button onClick={() => handleClick('')} className="filters-btn" disabled={!selectedCategory}>Clear filters</button>
            </div>
        </div >
    )
}

export default VendorEventFilter