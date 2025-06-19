const Train = require('../models/trainModel')

const createTrain = async (req, res) => {
    const { name, number, source, destination, description, departureDate, departureTime, arrivalDate, arrivalTime, classType, price, seatsTotal } = req.body
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
    if (!classType) emptyFields.push('classType')
    if (!price) emptyFields.push('price')
    if (!seatsTotal) emptyFields.push('seatsTotal')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const train = await Train.create({ name, number, source, destination, description, departureDate, departureTime, arrivalDate, arrivalTime, classType, price, seatsTotal, seatsAvailable: seatsTotal, vendorId: req.user._id })
        res.status(201).json(train)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { createTrain }