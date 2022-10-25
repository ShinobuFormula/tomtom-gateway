const {
	createUser,
	getUserByEmail,
	getUserByID,
	updatePassword,
	updateEmail,
	getUserByIdAndEmail,
} = require("../model/user");
const { createToken, verifyToken } = require("./token");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.connect = async (body) => {
	const { success, user } = await _checkPassword(body.email, body.password);
	console.log(success);
	if (success)
		return {
			token: createToken(user._id.toString()),
			userData: user,
		};
	return false;
};

exports.connectWithToken = async (cookie) => {
	const token = verifyToken(cookie);
	if (token.success && token.uid) {
		const userData = await getUserByID(token.uid);
		return { newToken: createToken(token.uid), userData };
	} else return false;
};

exports.register = async (body) => {
	const hash = await bcrypt.hash(
		body.password,
		parseInt(process.env.HASH_SALT)
	);
	body["password"] = hash;
	const newUser = await createUser(body);
	return newUser;
};

exports.updatePassword = async (uid, body) => {
	const { success, user } = await _checkPassword(body.email, body.password);
	if (!success) return false;
	// const authorizedChange = ["firstname", "lastname", "image"];
	// let numberOfRightKey = 0;
	// for (const [key, value] of Object.entries(body)) {
	// 	for (let index = 0; index < authorizedChange.length; index++) {
	// 		const element = authorizedChange[index];
	// 		if (key === element) {
	// 			numberOfRightKey++;
	// 			if (element === "password") {
	// 				const hash = await bcrypt.hash(body.password, 8);
	// 				body["password"] = hash;
	// 			}
	// 		}
	// 	}
	// }
	// if (numberOfRightKey === Object.keys(body).length)
	// 	return await updateUser(uid, body);
	// else return false;
	const hash = await bcrypt.hash(
		body.newPassword,
		parseInt(tprocess.env.HASH_SALT)
	);
	return await updatePassword(uid, hash);
};

exports.updateEmail = async (uid, body) => {
	const { success } = await _checkPassword(body.email, body.password, uid);
	if (!success) return false;
	return await updateEmail(uid, body.newEmail);
};

const _checkPassword = async (email, password, uid = null) => {
	let user = false;
	if (uid) user = await getUserByIdAndEmail(uid, email);
	else user = await getUserByEmail(email);
	if (!user) return { success: false };
	const samePwd = await bcrypt.compare(password, user.password);
	if (samePwd) return { success: true, user: user };
	return { success: false };
};
