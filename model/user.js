const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: false,
	},
	lastname: {
		type: String,
		required: false,
	},
	pseudo: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	birthdate: {
		type: Date,
		required: true,
	},
	captureLvl: {
		type: Number,
		required: false,
		default: 1,
	},
	adventureLvl: {
		type: Number,
		required: false,
		default: 1,
	},
	inventory: {
		type: Object,
		required: false,
		default: {},
	},
	stock: {
		type: Object,
		required: false,
		default: {},
	},
	team: {
		type: Object,
		required: false,
		default: {},
	},
});

const userModel = mongoose.model("user", userSchema);

exports.createUser = async (userData) => {
	console.log(userData);
	const duplicate = await userModel.find({ email: userData["email"] });

	if (duplicate.length === 0) {
		const user = new userModel(userData);
		return user.save();
	} else {
		return false;
	}
};

exports.getUserByEmail = async (email) => {
	const user = await userModel.findOne({ email: email });
	return user;
};

exports.getUserByID = async (uid) => {
	const user = await userModel.findOne({ _id: uid });
	return user;
};
