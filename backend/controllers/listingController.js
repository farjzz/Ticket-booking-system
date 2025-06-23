const Movie = require('../models/movieModel')
const Concert = require('../models/concertModel')
const Train = require('../models/trainModel')
const getEvents = async (req, res) => {
    try {
        const { type } = req.query
        let movies = []
        let concerts = []
        let trains = []
        if (!type || type == 'movie') {
            movies = await Movie.find()
        }
        if (!type || type == 'concert') {
            concerts = await Concert.find()
        }
        if (!type || type == 'train') {
            trains = await Train.find()
        }
        const Movies = movies.map(m => ({ ...m.toObject(), eventType: 'movie' }))
        const Concerts = concerts.map(c => ({ ...c.toObject(), eventType: 'concert' }))
        const Trains = trains.map(t => ({ ...t.toObject(), eventType: 'train' }))
        const events = [...Movies, ...Concerts, ...Trains].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEvent = async (req, res) => {
    const { id } = req.params
    try {
        let event = await Movie.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'movie' })
        event = await Concert.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'concert' })
        event = await Train.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'train' })
        return res.status(404).json({ error: 'Event not found' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { getEvents, getEvent }