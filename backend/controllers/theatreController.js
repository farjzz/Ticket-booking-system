const Theatre = require('../models/theatreModel')

const getTheatres = async (req, res) => {
    const { movie } = req.query
    try {
        const response = await Theatre.find({ movie }).sort({ createdAt: -1 })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getTheatres }