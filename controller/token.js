const jwt = require("jsonwebtoken");
require('dotenv').config()


exports.createToken = (uid) => {
    return jwt.sign({uid: uid}, process.env.JWT_KEY, { expiresIn: '24h' })
}

exports.verifyToken = (cookie) => {
    if(cookie.token) return jwt.verify(cookie.token, process.env.JWT_KEY, (err, decoded) => {
            if(err) return false
            return {success: true, uid : decoded.uid}
    });
    else return false

}