const Shows = require('../models/showModel')

const createShow = async (req, res) => {
    const { theatre, date, time, seatsAvailable, price, movie } = req.body//seats available should be the theatre's total seats
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!theatre) emptyFields.push('theatre')
    if (!date) emptyFields.push('date')
    if (!time) emptyFields.push('time')
    if (!seatsAvailable) emptyFields.push('seatsAvailable')
    if (!price) emptyFields.push('price')
    if (!movie) emptyFields.push('movie')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const show = await Shows.create({ theatre, date, time, seatsAvailable, price, movie, vendorId: req.user._id })
        res.status(201).json(show)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const getShows = async (req, res) => {
    const { theatre, movie } = req.query
    try {
        const response = await Shows.find({ theatre, movie }).sort({ createdAt: -1 }) //should be sorted acc to current date later
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTheatreByMovie = async (req, res) => {
    const { movie } = req.query
    try {
        const response = await Shows.find({ movie }).populate('theatre').sort({ date: 1, time: 1 })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteShow = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await Shows.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Show not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getShows, createShow, deleteShow, getTheatreByMovie }