import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
	pc: [{
		type: Object,
		required: false,
	}]
});

const stockModel = mongoose.model("Stock", stockSchema);


const createStock = async (stock) => {
	const newStock = await new stockModel(stock);
	return newStock.save();
};

export { createStock }