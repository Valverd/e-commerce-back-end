const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const Product = require('../Models/Product')


router.post('/', async (req, res) => {
    let user = await User.findById(req.body.user_id)
    if (!user) {
        return res.status(400).send('Usuário não logado!')
    }

    try {
        res.send(user.cart)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/addCart', async (req, res) => {
    let user = await User.findById(req.body.user_id)
    if (!user) {
        return res.status(400).send('Usuário não logado!')
    }

    let product_in_cart = user.cart.some(product => req.body.product._id === product._id)
    if (product_in_cart) {
        return res.status(400).send('Produto já foi adicionado no carrinho')
    }

    let updatedList = {
        cart: [...user.cart, req.body.product]
    }

    try {
        await User.findByIdAndUpdate(user._id, updatedList)
        res.send('Carrinho Atualizado')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/removeCart', async (req, res) => {
    let user = await User.findById(req.body.user_id)
    if (!user) {
        return res.status(400).send('Usuário não logado!')
    }

    let body_product = req.body.product_id
    let updatedList = user.cart.filter(product => product._id != body_product)

    let new_cart = {
        cart: updatedList
    }

    try {
        await User.findByIdAndUpdate(user._id, new_cart)
        res.send('Produto removido do carrinho!')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/updateCart', async (req, res) => {
    let user = await User.findById(req.body.user_id)
    if (!user) {
        return res.status(400).send('Usuário não logado!')
    }

    let cart = req.body.updated_cart
    let updated_cart = { cart }

    try {
        await User.findByIdAndUpdate(user._id, updated_cart)
        res.send('Carrinho atualizado!')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/buy', async (req, res) => {
    let user = await User.findById(req.body.user_id)
    let updatedList
    if (!user) {
        return res.status(400).send('Usuário não logado!')
    }

    if (req.body.buyByCart) {
        updatedList = {
            purchases: [...user.purchases, ...req.body.updatedList],
            cart: []
        }
    } else {
        updatedList = {
            purchases: [...user.purchases, ...req.body.updatedList]
        }
    }

    req.body.updatedList.map(async (new_product) => {
        let product_in_stock = await Product.findById(new_product._id)
        if ((product_in_stock.stock - new_product.qty) < 0) {
            return res.status(400).send('Produto sem estoque suficiente!')
        }
        await Product.findByIdAndUpdate(product_in_stock._id, { stock: (product_in_stock.stock - new_product.qty) })
    })

    try {
        await User.findByIdAndUpdate(user._id, updatedList)
        res.send('Compra Realizada!')
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router