require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const movieRoutes = require('./routes/movieRoutes')
const concertRoutes = require('./routes/concertRoutes')
const trainRoutes = require('./routes/trainRoutes')
const eventRoutes = require('./routes/eventRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const profileRoutes = require('./routes/profileRoutes')
const app = express()

app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/concerts', concertRoutes)
app.use('/api/trains', trainRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/profile', profileRoutes)
app.use('/uploads', express.static('uploads'))
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to db and listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

app.get('/', (req, res) => {
    res.json({ mssg: 'Server is running' })
})
