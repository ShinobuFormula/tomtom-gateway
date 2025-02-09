import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDb = () => {

	const mongoUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}?authSource=admin&replicaSet=atlas-de45xw-shard-0&readPreference=primary&ssl=true`;
	mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true } as mongoose.ConnectOptions);

	const db = mongoose.connection;

	db.on("error", console.error.bind(console, "MongoDB connection error:"));

	db.once("open", function () {
		console.log("MongoDB connected");
	});
	return db

}



export default connectToDb;
