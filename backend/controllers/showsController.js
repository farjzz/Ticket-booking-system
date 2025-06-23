const Shows = require('../models/showModel')

const getShows = async (req, res) => {
    const { theatre } = req.query
    try {
        const response = await Shows.find({ theatre }).sort({ createdAt: -1 }) //should be sorted acc to current date later
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getShows }