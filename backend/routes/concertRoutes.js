const { createConcert } = require('../controllers/concertController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createConcert)
module.exports = router