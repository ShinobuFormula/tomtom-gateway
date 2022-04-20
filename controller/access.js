const {createUser, getUserByEmail, getUserByID} = require('../model/user')
const {createToken, verifyToken} = require('./token')
const bcrypt = require('bcryptjs');

exports.connect = async (body) => {
    let user = await getUserByEmail(body.email)
    if(!user) return false;
    const samePwd = await bcrypt.compare(body.password, user.password)
    if(samePwd) return { token : createToken(user._id.toString()), userData : user }
    return false;
}

exports.connectWithToken = async (cookie) => {
    const token = verifyToken(cookie)
    let userData = {}
    if(token.response && token.uid){
        userData = await getUserByID(token.uid)
        return {newToken: createToken(token.uid), userData}
    }
    else return false
}

exports.register = async (body) => {
    const hash = await bcrypt.hash(body.password, 8)
    body["password"] = hash
    const newUser = await createUser(body)
    return newUser
}