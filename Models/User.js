const mongoose = require('mongoose')

const user_schema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    cart: {type: Array},
    purchases: {type: Array},
    profileImg: {type: String},
    createdDate: {type: Date, default: Date.now()}
})

const User = mongoose.model('User', user_schema)

module.exports = User