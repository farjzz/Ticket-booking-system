const { getClasses, createClass, deleteClass } = require('../controllers/classController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getClasses)
router.post('/', createClass)
router.delete('/:id', deleteClass)
module.exports = router