import mongoose from "mongoose";
import { Stock } from "./interfaces/user";

const stockSchema = new mongoose.Schema({
	pc: [{
		type: Object,
		required: false,
	}]
});

const stockModel = mongoose.model("Stock", stockSchema);


const createStock = async (stock: Stock) => {
	const newStock = await new stockModel(stock);
	return newStock.save();
};

export { createStock }