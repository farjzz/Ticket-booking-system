const Train = require('../models/trainModel')

const createTrain = async (req, res) => {
    const { name, number, source, destination, description, departureDate, departureTime, arrivalDate, arrivalTime } = req.body
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!name) emptyFields.push('name')
    if (!number) emptyFields.push('number')
    if (!source) emptyFields.push('source')
    if (!destination) emptyFields.push('destination')
    if (!departureDate) emptyFields.push('departureDate')
    if (!departureTime) emptyFields.push('departureTime')
    if (!arrivalDate) emptyFields.push('arrivalDate')
    if (!arrivalTime) emptyFields.push('arrivalTime')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const train = await Train.create({ name, number, source, destination, description, departureDate, departureTime, arrivalDate, arrivalTime, vendorId: req.user._id })
        res.status(201).json(train)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteTrain = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await Train.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Train not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const getTrain = async (req, res) => {
    const { id } = req.params
    try {
        const event = await Train.findById(id)
        return res.status(200).json({ ...event.toObject() })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { createTrain, deleteTrain, getTrain }