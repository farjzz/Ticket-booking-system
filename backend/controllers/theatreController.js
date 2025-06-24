const Theatre = require('../models/theatreModel')

const createTheatre = async (req, res) => {
    const { theatre_name, location, seatsTotal } = req.body
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!theatre_name) emptyFields.push('theatre_name')
    if (!location) emptyFields.push('location')
    if (!seatsTotal) emptyFields.push('seatsTotal')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const theatre = await Theatre.create({ theatre_name, location, seatsTotal, vendorId: req.user._id })
        res.status(201).json(theatre)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getTheatres = async (req, res) => {
    try {
        const response = await Theatre.find().sort({ createdAt: -1 })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteTheatre = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await Theatre.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Theatre not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getTheatres, createTheatre, deleteTheatre }