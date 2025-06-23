const mongoose = require('mongoose')
const Schema = mongoose.Schema
const classSchema = new Schema({
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true
    },
    classType: {
        type: String,
        required: true //gotta add enum
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
    }
}, { timestamps: true })
module.exports = mongoose.model('TrainClass', classSchema)
