const {createUser, getUserByEmail} = require('../model/user')
const {createToken} = require('./token.controller')
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
    console.log(body)
    return await bcrypt.hash(body.password, 8).then((hash) => {
        let userData = body
        //body["password"] = hash instead of let etc..
        userData.password = hash
        //double return???? check that
        return createUser(userData).then( (user) => {
            return user
        })
    })
}