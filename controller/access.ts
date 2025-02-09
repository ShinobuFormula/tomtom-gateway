import {
	createUser,
	getUserByEmail,
	getUserByID,
	updatePassword,
	updateEmail,
	getUserByIdAndEmail,
} from "../model/user.js";
import { createToken, verifyToken } from "./token.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const connect = async (body) => {
	const { success, user } = await _checkPassword(body.email, body.password);
	if (success)
		return {
			token: createToken(user._id.toString()),
			userData: user,
		};
	return false;
};

const connectWithToken = async (cookie) => {
	const token = verifyToken(cookie);
	if (token.success && token.uid) {
		const userData = await getUserByID(token.uid);
		return { newToken: createToken(token.uid), userData };
	} else return false;
};

const register = async (body) => {
	const hash = await bcrypt.hash(
		body.password,
		parseInt(process.env.HASH_SALT)
	);
	body["password"] = hash;
	const newUser = await createUser(body);
	return newUser;
};

const updtPassword = async (uid, body) => {
	const { success } = await _checkPassword(body.email, body.password);
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
		parseInt(process.env.HASH_SALT)
	);
	return await updatePassword(uid, hash);
};

const updtEmail = async (uid, body) => {
	const { success } = await _checkPassword(body.email, body.password, uid);
	if (!success) return false;
	return await updateEmail(uid, body.newEmail);
};

const _checkPassword = async (email, password, uid = null) => {
	let user = null;
	if (uid) user = await getUserByIdAndEmail(uid, email);
	else user = await getUserByEmail(email);
	if (user == null) return { success: false };
	const samePwd = await bcrypt.compare(password, user.password);
	if (samePwd) return { success: true, user: user };
	return { success: false };
};

export { connect, connectWithToken, updtEmail, updtPassword, register }
