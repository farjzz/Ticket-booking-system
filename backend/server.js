require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const app = express()

app.use(express.json())
app.use('/api/user', userRoutes)

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
