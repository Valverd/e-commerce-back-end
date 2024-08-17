const mongoose = require('mongoose')

const generic_schema = new mongoose.Schema({}, {strict: false})

const Product = mongoose.model('Product', generic_schema, 'products')

module.exports = Product