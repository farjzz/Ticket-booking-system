const mongoose = require('mongoose')
const Schema = mongoose.Schema
const theatreSchema = new Schema({
    theatre_name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    seatsTotal: {
        type: Number,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Theatre', theatreSchema)