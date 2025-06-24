const { createMovie, deleteMovie } = require('../controllers/movieController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createMovie)
router.delete('/:id', deleteMovie)
module.exports = router