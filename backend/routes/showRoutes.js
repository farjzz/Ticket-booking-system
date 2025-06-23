const { getShows } = require('../controllers/showsController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getShows)
module.exports = router