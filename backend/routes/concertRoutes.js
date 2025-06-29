const { createConcert, deleteConcert, getConcert } = require('../controllers/concertController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createConcert)
router.delete('/:id', deleteConcert)
router.get('/:id', getConcert)
module.exports = router