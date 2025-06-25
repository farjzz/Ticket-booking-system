const { createMovie, deleteMovie, getMovie } = require('../controllers/movieController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createMovie)
router.delete('/:id', deleteMovie)
router.get('/:id', getMovie)
module.exports = router