const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors({
    credentials: true,
    origin: 'https://127.0.0.1:5173'
}))

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    res.json(name, email, password)
})

app.listen(8000)