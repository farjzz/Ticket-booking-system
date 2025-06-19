const { bookEvent, getBookings, cancelBooking } = require('../controllers/bookingController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', bookEvent)
router.get('/', getBookings)
router.delete('/:id', cancelBooking)
module.exports = router