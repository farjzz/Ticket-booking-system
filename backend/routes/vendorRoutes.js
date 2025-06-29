const { getVendorEvents, getVendorEvent } = require('../controllers/vendorController')
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
router.use(requireAuth)
router.get('/', getVendorEvents)
router.get('/:id', getVendorEvent)
module.exports = router