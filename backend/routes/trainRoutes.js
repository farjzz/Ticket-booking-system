const { createTrain, deleteTrain } = require('../controllers/trainController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createTrain)
router.delete('/:id', deleteTrain)
module.exports = router