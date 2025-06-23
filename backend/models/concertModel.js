const mongoose = require('mongoose')
const Schema = mongoose.Schema
const concertSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    language: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    durationInMins: {
        type: Number,
        //required: true
    },
    seatsTotal: {
        type: Number,
        required: true
    },
    seatsAvailable: {
        type: Number,
        //required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Concert', concertSchema)
