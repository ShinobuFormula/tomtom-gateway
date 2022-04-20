const {createUser, getUserByEmail} = require('../model/user')
const {createToken} = require('./token')
const bcrypt = require('bcryptjs');

exports.connect = async (body) => {
    let user = await getUserByEmail(body.email)
    if(!user) return false;
    const samePwd = await bcrypt.compare(body.password, user.password)
    if(samePwd) return { token : createToken(user._id.toString()), userData : user }
    return false;
    
}

exports.register = async (body) => {
    const hash = await bcrypt.hash(body.password, 8)
    body["password"] = hash
    const newUser = await createUser(body)
    return newUser
}