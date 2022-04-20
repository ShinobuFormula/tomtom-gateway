const {createUser, getUserByEmail} = require('../model/user')
const {createToken} = require('./token')
const bcrypt = require('bcryptjs');

exports.connect = async (body) => {
    //envoie que l'email
    let user = await getUserByEmail(body)
    if(!user) return false;
    //double return await and return ???
   return await bcrypt.compare(body.password, user.password).then((res) => {
        if(res) return { token : createToken(user._id.toString()), userData : user }
        return false;
    })
}

exports.register = async (body) => {
    const hash = await bcrypt.hash(body.password, 8)
    body["password"] = hash
    const newUser = await createUser(body)
    return newUser
}