const jwt = require('jsonwebtoken')

async function auth(req, res, next) {
    const token = req.headers.authorization

    if(!token) {
        return res.status(401).send('Você deve fazer login para acessar esta área!')
    }

    try {
        await jwt.verify(token, process.env.TOKEN_SECRET)
        next()
    } catch (error) {
        res.status(401).send('Você deve fazer login para acessar esta área!')
    }
}

module.exports = auth