const mongoose = require('mongoose')
const Schema = mongoose.Schema
const trainSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    departureDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    classType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seatsTotal: {
        type: Number,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Train', trainSchema)
