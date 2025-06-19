const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    wallet: {
        type: Number,
        required: true,
        default: 500
    },
    profilePic: {
        type: String,
        default: ''
    }
}, { timestamps: true })

userSchema.statics.signup = async function (email, password, name, role) {
    if (!email || !password || !name) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email is already in use')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ name, email, password: hash, role })
    return user
}
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }
    return user
}
module.exports = mongoose.model('User', userSchema)