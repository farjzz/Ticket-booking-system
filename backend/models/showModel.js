const mongoose = require('mongoose')
const Schema = mongoose.Schema

const showSchema = new Schema({
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Show', showSchema)