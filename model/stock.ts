import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    pc: [{
		type: Object,
		required: false,
	}]
});