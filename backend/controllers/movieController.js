const Movie = require('../models/movieModel')

const createMovie = async (req, res) => {
    const { name, genre, language, description, date, time, theatre_name, location, price, seatsTotal } = req.body
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!name) emptyFields.push('name')
    if (!genre) emptyFields.push('genre')
    if (!date) emptyFields.push('date')
    if (!time) emptyFields.push('time')
    if (!theatre_name) emptyFields.push('theatre_name')
    if (!location) emptyFields.push('location')
    if (!price) emptyFields.push('price')
    if (!seatsTotal) emptyFields.push('seatsTotal')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const movie = await Movie.create({ name, genre, language, description, date, time, theatre_name, location, price, seatsTotal, seatsAvailable: seatsTotal, vendorId: req.user._id })
        res.status(201).json(movie)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { createMovie }