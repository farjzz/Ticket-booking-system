const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bookingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        enum: ['Show', 'Concert', 'TrainClass'],
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'eventType'
    },
    seatsBooked: {
        type: Number,
        required: true
    },
    seatsSelected: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)