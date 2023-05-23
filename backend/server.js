require('dotenv').config()
const DBConnect = require('./db')
const express = require('express')
const app = express()
const router = require('./routes')

const PORT = process.env.PORT || 5500
DBConnect()
app.use(express.json())
app.use(router)
app.get('/', (req, res) => {
    res.send('Hello from express JS')
})
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))