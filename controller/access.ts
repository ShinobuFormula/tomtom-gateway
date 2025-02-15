import { createStock } from "../model/stock.js";
import { Stock, User } from "../model/interfaces/user.js";
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

const connect = async (body: { email: string, password: string }) => {
	const { success, user } = await _checkPassword(body.email, body.password);
	const filledUser: User = await _fillUserTeam(user._id);
	if (success)
		return {
			token: createToken(user._id.toString()),
			userData: filledUser ? filledUser : user,
		};
	return false;
};

const connectWithToken = async (cookie) => {
	const { success, uid } = verifyToken(cookie);
	if (success && uid !== null) {
		const userData: User = await getUserByID(uid);
		return { newToken: createToken(uid), user: userData };
	} else return { newToken: null, user: null };
};

const register = async (body: User) => {
	const hash = await bcrypt.hash(
		body.password,
		parseInt(process.env.HASH_SALT)
	);
	body.password = hash;
	const newStock = await _prepareStock()
	body.stock = newStock._id;
	const newUser = await createUser(body);
	return newUser;
};

const updtPassword = async (uid: string, body: { email: string, password: string, newPassword: string }) => {
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

const updtEmail = async (uid: string, body: { email: string, password: string, newEmail: string }) => {
	const { success } = await _checkPassword(body.email, body.password, uid);
	if (!success) return false;
	return await updateEmail(uid, body.newEmail);
};

const _checkPassword = async (email: string, password: string, uid = null) => {
	let user: User = null;
	if (uid) user = await getUserByIdAndEmail(uid, email);
	else user = await getUserByEmail(email);
	if (user == null) return { success: false };
	const samePwd = await bcrypt.compare(password, user.password);
	if (samePwd) return { success: true, user: user };
	return { success: false };
};


const _fillUserTeam = async (userId: string) => {
	try {
		const fetchedUser = await fetch(process.env.SERVICE_MONSTER_URL + "stock/team/" + userId)
		if (fetchedUser.ok) return fetchedUser.json()
	} catch (error) {
		console.log(error);
	}
}

const _prepareStock = async () => {
	const stock: Stock = { pc: [] }
	return await createStock(stock);
}

export { connect, connectWithToken, updtEmail, updtPassword, register }
