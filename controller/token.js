const jwt = require("jsonwebtoken");
require('dotenv').config()


exports.createToken = (uid) => {
    return jwt.sign({uid: uid}, process.env.JWT_KEY, { expiresIn: '24h' })
}

exports.verifyToken = (cookie) => {
    let response;
    let userData = {};
    //if(cookie.token) jwt.verify
    //response = false
    if(cookie.token)
    {
        //es6? (err, decoded) => 
        jwt.verify(cookie.token, process.env.JWT_KEY, function(err, decoded) {
            //if(err) response = false
            //response = true
            //userData = decoded.uid
            if(err){
                response = false
            }
            else {
                response = true
                userData = decoded.uid
            }
        });
    }
    else {
        response = false
    }
    //response => success
    return { response: response, userData };
}