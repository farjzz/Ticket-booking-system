const Movie = require('../models/movieModel')
const Concert = require('../models/concertModel')
const Train = require('../models/trainModel')
const getEvents = async (req, res) => {
    try {
        const { type } = req.query
        let movies = []
        let concerts = []
        let trains = []
        if (!type || type == 'movies') {
            movies = await Movie.find()
        }
        if (!type || type == 'concerts') {
            concerts = await Concert.find()
        }
        if (!type || type == 'trains') {
            trains = await Train.find()
        }
        const Movies = movies.map(m => ({ ...m.toObject(), eventType: 'movie' }))
        const Concerts = concerts.map(c => ({ ...c.toObject(), eventType: 'concert' }))
        const Trains = trains.map(t => ({ ...t.toObject(), eventType: 'train' }))
        const events = [...Movies, ...Concerts, ...Trains]
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = { getEvents }