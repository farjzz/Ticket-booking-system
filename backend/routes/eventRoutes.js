const { getEvents, getEvent } = require('../controllers/listingController')
const express = require('express')
const router = express.Router()
router.get('/', getEvents)
router.get('/:id', getEvent)
module.exports = router