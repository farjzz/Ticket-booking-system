const Theatre = require('../models/theatreModel')
const Concert = require('../models/concertModel')
const Train = require('../models/trainModel')
const User = require('../models/userModel')
const getVendorEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user || user.role != 'vendor') return res.status(400).json({ error: 'Unauthorized' })
        const { type } = req.query
        let theatres = []
        let concerts = []
        let trains = []
        if (!type || type == 'Theatre') {
            theatres = await Theatre.find({ vendorId: req.user._id })
        }
        if (!type || type == 'Concert') {
            concerts = await Concert.find({ vendorId: req.user._id })
        }
        if (!type || type == 'Train') {
            trains = await Train.find({ vendorId: req.user._id })
        }
        const Theatres = theatres.map(s => ({ ...s.toObject(), eventType: 'Theatre' }))
        const Concerts = concerts.map(c => ({ ...c.toObject(), eventType: 'Concert' }))
        const Trains = trains.map(t => ({ ...t.toObject(), eventType: 'Train' }))
        const events = [...Theatres, ...Concerts, ...Trains].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getVendorEvent = async (req, res) => {
    const { id } = req.params
    try {
        let event = await Theatre.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'Theatre' })
        event = await Concert.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'Concert' })
        event = await Train.findById(id)
        if (event) return res.status(200).json({ ...event.toObject(), eventType: 'TrainClass' })
        return res.status(404).json({ error: 'Event not found' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { getVendorEvents, getVendorEvent }