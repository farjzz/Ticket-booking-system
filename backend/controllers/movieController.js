const Movie = require('../models/movieModel')

const createMovie = async (req, res) => {
    const { name, genre, language, description, durationInMins } = req.body
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!name) emptyFields.push('name')
    if (!durationInMins) emptyFields.push('durationInMins')
    if (!genre) emptyFields.push('genre')
    if (!language) emptyFields.push('language')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const movie = await Movie.create({ name, genre, language, description, durationInMins, vendorId: req.user._id })
        res.status(201).json(movie)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteMovie = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await Movie.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Movie not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { createMovie, deleteMovie }