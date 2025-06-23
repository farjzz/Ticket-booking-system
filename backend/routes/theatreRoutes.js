const { getTheatres } = require('../controllers/theatreController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getTheatres)
module.exports = router