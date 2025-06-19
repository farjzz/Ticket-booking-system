const { getEvents } = require('../controllers/listingController')
const express = require('express')
const router = express.Router()
router.get('/', getEvents)
module.exports = router