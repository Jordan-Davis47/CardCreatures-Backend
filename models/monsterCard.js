const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImageSchema = require("./image");

const MonsterCardSchema = new Schema({
	name: { type: String, required: true },
	atk: {
		type: Number,
		required: true,
	},
	def: {
		type: Number,
		required: true,
	},
	cardDescription: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
	},
	deck: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Deck",
	},
	type: { type: String, required: true },
	id: { type: String },
});

module.exports = mongoose.model("MonsterCard", MonsterCardSchema);
