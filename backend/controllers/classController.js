const TrainClass = require('../models/TrainClassModel')

const getClasses = async (req, res) => {
    const { train } = req.query
    try {
        const response = await TrainClass.find({ train }).sort({ createdAt: -1 })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getClasses }