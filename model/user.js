const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstname: {
        type :String,
        required: false
    },
    lastname: {
        type :String,
        required: false
    },
    pseudo: {
        type :String,
        required: true
    },
    password: {
        type :String,
        required: true
    },
    email: {
        type :String,
        required: true
    },
    captureLvl: {
        type : Number,
        required: false
    },
    adventureLvl: {
        type : Number,
        required: false
    },
    inventoryID: {
        type : String,
        required: true
    },
    stockID: {
        type : String,
        required: true
    }
})

const userModel = mongoose.model("user", userSchema);

exports.createUser = async (userData) => {
    const duplicate = await userModel.find({email: userData["email"]});
    
    if(duplicate.length === 0){
        const user = new userModel(userData);
        return user.save();
    }
    else{
        return false
    }
};

exports.getUserByEmail =  async (email) => {
    const user = await userModel.findOne({email: email});
    return user;
}