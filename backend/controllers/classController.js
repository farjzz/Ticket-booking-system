const TrainClass = require('../models/TrainClassModel')

const createClass = async (req, res) => {
    const { train, classType, price, seatsTotal } = req.body
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!train) emptyFields.push('train')
    if (!classType) emptyFields.push('classType')
    if (!price) emptyFields.push('price')
    if (!seatsTotal) emptyFields.push('seatsTotal')
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const classs = await TrainClass.create({ train, classType, price, seatsAvailable: seatsTotal, seatsTotal })
        res.status(201).json(classs)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getClasses = async (req, res) => {
    const { train } = req.query
    try {
        const response = await TrainClass.find({ train }).sort({ createdAt: -1 })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteClass = async (req, res) => {
    const { id } = req.params
    if (req.user.role != 'vendor') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const response = await TrainClass.findOneAndDelete({ _id: id, vendorId: req.user._id })
        if (!response) {
            return res.status(404).json({ error: 'Class not found' })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { getClasses, createClass, deleteClass }