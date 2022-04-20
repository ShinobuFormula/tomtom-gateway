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
const { connect, register } = require("./controller/access")


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
    res.json(await connect(req.body))
})

app.use('/', (req, res, next) => {



    if (req.path.includes('monster')){
        serviceMonsterProxy(req, res, next);
    } else if (req.path.includes('fight')) {
        serviceFightProxy(req, res, next);
    }
});

app.listen(3000)