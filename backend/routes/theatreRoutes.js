const { getTheatres, createTheatre, deleteTheatre } = require('../controllers/theatreController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getTheatres)
router.post('/', createTheatre)
router.delete('/:id', deleteTheatre)
module.exports = router