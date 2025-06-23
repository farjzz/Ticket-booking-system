const mongoose = require('mongoose')
const Schema = mongoose.Schema
const movieSchema = new Schema({
    name: {
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
    durationInMins: {
        type: Number,
        required: true
    },
    //add poster
}, { timestamps: true })

module.exports = mongoose.model('Movie', movieSchema)