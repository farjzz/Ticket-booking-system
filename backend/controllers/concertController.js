const { get } = require('mongoose')
const Concert = require('../models/concertModel')

const createConcert = async (req, res) => {
    const { name, artist, genre, language, description, date, time, venue, location, price, seatsTotal } = req.body
    const poster = req.file ? `/uploads/${req.file.filename}` : undefined
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!name) emptyFields.push('name')
    if (!artist) emptyFields.push('artist')
    if (!genre) emptyFields.push('genre')
    if (!date) emptyFields.push('date')
    if (!time) emptyFields.push('time')
    if (!venue) emptyFields.push('venue')
    if (!location) emptyFields.push('location')
    if (!price) emptyFields.push('price')
    if (!seatsTotal) emptyFields.push('seatsTotal')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const concert = await Concert.create({ name, artist, genre, language, description, date, time, venue, location, price, seatsTotal, seatsAvailable: seatsTotal, vendorId: req.user._id, poster })
        res.status(201).json(concert)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteConcert = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await Concert.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Concert not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const getConcert = async (req, res) => {
    const { id } = req.params
    try {
        const event = await Concert.findById(id)
        return res.status(200).json({ ...event.toObject() })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { createConcert, deleteConcert, getConcert }