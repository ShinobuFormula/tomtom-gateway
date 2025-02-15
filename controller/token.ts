import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (uid: string) => {
	return jwt.sign({ uid: uid }, process.env.JWT_KEY, { expiresIn: "24h" });
};

const verifyToken = (cookie): { success: boolean, uid: string } => {
	if (cookie.token)
		return jwt.verify(cookie.token, process.env.JWT_KEY, (err, decoded) => {
			if (err) return { success: false, uid: null };
			return { success: true, uid: decoded.uid };
		});
	else return { success: false, uid: null };
};

export { createToken, verifyToken }