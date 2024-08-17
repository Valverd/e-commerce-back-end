const express = require('express')
const router = express.Router()
const Product = require('../Models/Product')

router.get('/', async (req, res) => {
    await Product.find()
        .then((products) => {
            res.send(products)
        })
        .catch(error => res.status(400).send(error))
})

router.post('/id', async (req, res) => {
    let id = req.body.id
    let selected_product = await Product.findById(id)

    if(!selected_product){
        res.status(404).send('Não foi possível achar o produto.')
    }

    try{
        res.send(selected_product)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router