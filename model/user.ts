import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	pseudo: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: false,
	},
	lastname: {
		type: String,
		required: false,
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
	stock: {
		type: String,
		required: false,
	},
	team: {
		type: Object,
		required: false,
		default: {},
	},
});

const userModel = mongoose.model("user", userSchema);

const createUser = async (userData) => {
	const duplicate = await userModel.find({ email: userData["email"] });

	if (duplicate.length === 0) {
		const user = new userModel(userData);
		return user.save();
	} else {
		return false;
	}
};

const getUserByEmail = async (email) => {
	const user = await userModel.findOne({ email: email });
	return user;
};

const getUserByID = async (uid) => {
	const user = await userModel.findOne({ _id: uid });
	return user;
};

const getUserByIdAndEmail = async (uid, email) => {
	const user = await userModel.findOne({ _id: uid, email: email });
	return user;
};

const updatePassword = async (uid, password) => {
	const user = await userModel.findOneAndUpdate(
		{ _id: uid },
		{ password },
		{
			new: true,
		}
	);
	user.save();
	return user;
};

const updateEmail = async (uid, email) => {
	const user = await userModel.findOneAndUpdate(
		{ _id: uid },
		{ email },
		{
			new: true,
		}
	);
	user.save();
	return user;
};

export {
	createUser, getUserByEmail, updateEmail, updatePassword, getUserByID, getUserByIdAndEmail
}