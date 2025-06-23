const { getClasses } = require('../controllers/classController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getClasses)
module.exports = router