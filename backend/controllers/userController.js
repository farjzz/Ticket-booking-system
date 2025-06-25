const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = (_id) => {
    //change expires in after if needed.. why is this not exported??
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

module.exports = { loginUser, signupUser }