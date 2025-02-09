import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (uid) => {
	return jwt.sign({ uid: uid }, process.env.JWT_KEY, { expiresIn: "24h" });
};

const verifyToken = (cookie) => {
	if (cookie.token)
		return jwt.verify(cookie.token, process.env.JWT_KEY, (err, decoded) => {
			if (err) return false;
			return { success: true, uid: decoded.uid };
		});
	else return false;
};

export { createToken, verifyToken }