const { createTrain, deleteTrain, getTrain } = require('../controllers/trainController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.post('/', createTrain)
router.delete('/:id', deleteTrain)
router.get('/:id', getTrain)
module.exports = router