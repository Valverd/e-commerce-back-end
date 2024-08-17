const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).send('Você deve fazer login para acessar esta área!')
    }
    
    try {
        await jwt.verify(token, process.env.TOKEN_SECRET)
        res.send('Logado')

    } catch (error) {
        res.status(401).send('Você deve fazer login para acessar esta área!')
    }
})

module.exports = router