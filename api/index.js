const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "abcabcabcabcabc"
const CookieParser = require("cookie-parser")

require("dotenv").config();
app.use(express.json());
app.use(CookieParser())
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("connect start")).catch(console.error())


app.get("/test", (req, res) => {
    res.json("test okay");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    // res.json({name, email, password})
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            password,
        });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const userDoc = await User.findOne({ email })
    if (userDoc) {
        const pass_check = bcrypt.compareSync(password, userDoc.password)
        if (pass_check) {
            jwt.sign({ email: userDoc.email, id: userDoc._id, name: userDoc.name }, jwtSecret, {}, (error, token) => {
                if (error)
                    throw error
                res.cookie('token', token).json(userDoc)
            })
        }
        else
            res.json("wrong pass")
    }
    else
        res.json('not found')
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err
            const {name, email, _id} = await User.findById(userData.id)
            res.json({name, email, _id})
        })
    }
    else
        res.json(null)
})

app.listen(8000);
