import express from "express";
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
	const newUser = await register(req.body)
	if(newUser) res.json(newUser)
	else res.status(400).send("Given email is already used")
	
});

app.post("/connect", async (req, res) => {
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
});

app.put("/password/:id", async (req, res) => {
	const updated = await updtPassword(req.params.id, req.body);
	if(updated) res.json(updated);
	else res.status(401).send("Wrong credentials")
	
});
app.put("/email/:id", async (req, res) => {
	const updated = await updtEmail(req.params.id, req.body);
	if(updated) res.json(updated);
	else res.status(401).send("Wrong credentials")
});

app.post("/refresh", async (req, res) => {
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
});

app.use("/", (req, res, next) => {
	if (req.path.includes("monster")) {
		serviceMonsterProxy(req, res, next);
	} else if (req.path.includes("fight")) {
		serviceFightProxy(req, res, next);
	}
});

app.listen(3000, () => {
	console.log("tomtom getaway started");
});
