const Concert = require('../models/concertModel')
const Movie = require('../models/movieModel')
const Train = require('../models/trainModel')
const Booking = require('../models/bookingModel')

const bookEvent = async (req, res) => {
    const { eventType, eventId, seatsBooked, seatsSelected } = req.body
    if (req.user.role != 'user') {
        return res.status(403).json({ error: 'Access denied' })
    }
    let emptyFields = []
    if (!eventType) emptyFields.push('eventType')
    if (!eventId) emptyFields.push('eventId')
    if (!seatsBooked && seatsBooked != 0) emptyFields.push('seatsBooked') //later add seatsSelected upon adding the grid
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }
    if (seatsBooked <= 0) {
        return res.status(400).json({ error: 'Book atleast one seat' })
    }
    let model
    switch (eventType) {
        case 'movie':
            model = Movie
            break
        case 'concert':
            model = Concert
            break
        case 'train':
            model = Train
            break
        default:
            return res.status(400).json({ error: 'Invalid event type' })
    }
    try {
        const event = await model.findById(eventId)
        if (!event) {
            return res.status(404).json({ error: 'Event not found' })
        }
        if (event.seatsAvailable < seatsBooked) {
            return res.status(400).json({ error: 'Not enough seats available' })
        }
        event.seatsAvailable -= seatsBooked
        await event.save()
        const booking = await Booking.create({ userId: req.user._id, eventType, eventId, seatsBooked, seatsSelected })
        res.status(201).json(booking)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(bookings)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const cancelBooking = async (req, res) => {
    const { id } = req.params
    try {
        const booking = await Booking.findById(id)
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' })
        }
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized user' })
        }
        let model
        switch (booking.eventType) {
            case 'movie':
                model = Movie
                break
            case 'concert':
                model = Concert
                break
            case 'train':
                model = Train
                break
            default:
                return res.status(400).json({ error: 'Invalid event type' })
        }
        const event = await model.findById(booking.eventId)
        if (event) {
            event.seatsAvailable += booking.seatsBooked
            await event.save()
        }
        await booking.deleteOne()
        res.status(200).json({ message: 'Booking cancelled successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { bookEvent, getBookings, cancelBooking }