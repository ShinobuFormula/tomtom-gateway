import express, { Request, Response } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
//mongodb
import connectToDb from "./db.js";
//middleware
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import httpProxy from "express-http-proxy";
import cors from "cors"
import {
	connect,
	register,
	connectWithToken,
	updtPassword,
	updtEmail,
} from "./controller/access.js";

const serviceMonsterProxy = httpProxy(
	process.env.SERVICE_MONSTER_URL || "http://localhost:3000"
);
const serviceFightProxy = httpProxy(
	process.env.SERVICE_FIGHT_URL || "http://localhost:3000"
);

app.use(bodyParser.json());
app.use(cookieParser());

var corsOptions = {
	origin: true,
	credentials: true,
	optionsSuccessStatus: 200,
};

connectToDb();

app.use(cors(corsOptions));

app.post("/register", async (req, res) => {
	try {
		const newUser = await register(req.body)
		if (newUser) res.json(newUser);
		else res.status(404).send("Already used email");
	} catch (error) {
		console.log(error);
		res.status(403).send("Bad Request");
	}
});

app.post("/connect", async (req, res) => {
	try {
		const connected = await connect(req.body);
		if (connected)
			res
				.cookie("token", connected.token, {
					path: "/",
					sameSite: "none",
					secure: true,
					expires: new Date(Date.now() + 48 * 3600000),
				})
				.json(connected.userData);
		else res.status(401).send("Wrong credentials");
	} catch (error) {
		res.status(403).send("Bad Request");
	}
});

app.put("/password/:id", async (req, res) => {
	try {
		const updated = await updtPassword(req.params.id, req.body);
		if (updated) res.json(updated);
		else res.status(401).send("Wrong credentials")
	} catch (error) {
		res.status(403).send("Bad Request");
	}
});
app.put("/email/:id", async (req, res) => {
	try {
		const updated = await updtEmail(req.params.id, req.body);
		if (updated) res.json(updated);
		else res.status(401).send("Wrong credentials")
	} catch (error) {
		res.status(403).send("Bad Request");
	}
});

app.post("/refresh", async (req, res) => {
	try {
		const connected = await connectWithToken(req.cookies);
		if (connected)
			res
				.cookie("token", connected.newToken, {
					path: "/",
					sameSite: "none",
					secure: true,
					expires: new Date(Date.now() + 48 * 3600000),
				})
				.json(connected.userData);
		else res.status(401).send("Access token not valid");
	} catch (error) {
		res.status(403).send("Bad Request");
	}
});

app.use("/", (req: Request, res: Response, next) => {
	if (
		req.path.includes("monster") ||
		req.path.includes("passive") ||
		req.path.includes("skill") ||
		req.path.includes("stock")
	) {
		serviceMonsterProxy(req, res, next);
	} else if (req.path.includes("fight")) {
		serviceFightProxy(req, res, next);
	}
});

app.listen(3000, () => {
	console.log("tomtom gateway started");
});
