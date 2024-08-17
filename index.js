require('dotenv').config()
const PORT = 5000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter = require('./routes/userRouter')
const productsRouter = require('./routes/productsRouter')
const purchasesRouter = require('./routes/purchasesRouter')
const auth = require('./Controller/authController')
const cors = require('cors')
const verifyToken = require('./Controller/verifyToken')

mongoose.connect(process.env.MONGODB_CONNECT)

app.use(cors())
app.use(express.json(), express.urlencoded({ extended: false }))

app.use('/token', verifyToken)
app.use('/user', userRouter)
app.use('/products', productsRouter)
app.use('/purchase', auth, purchasesRouter)

app.listen(PORT)