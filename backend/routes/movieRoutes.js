const { createMovie } = require('../controllers/movieController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createMovie)
module.exports = router