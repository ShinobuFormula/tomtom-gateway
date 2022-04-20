const express = require('express')
const app = express()
require('dotenv').config()
//mongodb
const db = require('./db')
//middleware
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const httpProxy = require('express-http-proxy')
//micro-services
const serviceMonsterProxy = httpProxy(process.env.SERVICE_MONSTER_URL || 'http://localhost:3000');
const serviceFightProxy = httpProxy(process.env.SERVICE_FIGHT_URL || 'http://localhost:3000');
//controllers
const { connect, register, connectWithToken } = require("./controller/access")
const { verifyToken } = require('./controller/token')


app.use(bodyParser.json())
app.use(cookieParser());

var corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

//Route de connexion/inscription
//refresh token
//Verif token before access route


app.post('/register', async (req, res) => {
    res.json(await register(req.body))
})

app.post('/connect', async (req, res) => {
    const connected = await connect(req.body)
    if(connected) res.cookie("token", connected.token, { path: "/" }).json(connected.userData)
    else res.status(401).send("Wrong credentials")
})

app.get('/refresh', async (req, res) => {
    console.log("refresh");
    const connected = await connectWithToken(req.cookies)
    if(connected) res.cookie("token", connected.newToken, { path: "/" }).json(connected.userData)
    else res.json(connected)
})

//will be removed only here for test
app.get('/check', (req, res) => {
    res.json(verifyToken(req.cookies))
})

app.use('/', (req, res, next) => {



    if (req.path.includes('monster')){
        serviceMonsterProxy(req, res, next);
    } else if (req.path.includes('fight')) {
        serviceFightProxy(req, res, next);
    }
});

app.listen(3000)