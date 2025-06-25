const { signupUser, loginUser, forgotPassword, resetPassword } = require('../controllers/userController')
const express = require('express')
const router = express.Router()
router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
module.exports = router