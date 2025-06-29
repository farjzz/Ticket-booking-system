const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const validator = require('validator')

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editProfile = async (req, res) => {
    const { name, email } = req.body
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        if (email && email != user.email) {
            const check = await User.findOne({ email })
            if (check) {
                return res.status(400).json({ error: 'Email is already in use' })
            }
            user.email = email
        }
        if (name) user.name = name
        if (profilePic) user.profilePic = profilePic
        await user.save()
        const updatedUser = await User.findById(req.user._id).select('-password')
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    if (newPassword != confirmPassword) {
        return res.status(400).json({ error: "New passwords don't match" })
    }
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            return res.status(400).json({ error: 'Old password is incorrect' })
        }
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ error: 'Password is not strong enough' })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        user.password = hash
        await user.save()
        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getProfile, editProfile, changePassword }