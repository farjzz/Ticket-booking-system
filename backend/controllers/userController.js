const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

const createToken = (_id) => {
    //change expires in after if needed
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({ name: user.name, email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const signupUser = async (req, res) => {
    const { email, password, name, role } = req.body
    try {
        const user = await User.signup(email, password, name, role)
        const token = createToken(user._id)
        res.status(200).json({ name: user.name, email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'Email not found' })
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 20
    await user.save()
    const resetLink = `http://localhost:3000/reset-password/${token}`
    const message = `Click on this link to reset your password.\nhttp://localhost:3000/reset-password/${token}\nIf you did not request for a password reset, you can ignore this email`
    try {
        await sendEmail(email, 'Reset your password - BookItAll', message)
        res.status(200).json({ message: 'Reset link is sent to email' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email. Try again later.' })
    }
    //console.log(`Reset link: http://localhost:3000/reset-password/${token}`)
}

const resetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    user.password = hash
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()
    res.status(200).json({ message: 'Password reset successful' })
}

module.exports = { loginUser, signupUser, forgotPassword, resetPassword }