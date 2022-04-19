const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const httpProxy = require('express-http-proxy')

const serviceMonsterProxy = httpProxy(process.env.SERVICE_MONSTER_URL || 'http://localhost:3000');

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

app.use('/', (req, res, next) => {
    if (req.path.includes('monster')){
        serviceMonsterProxy(req, res, next);
    }
});

app.listen(3000)