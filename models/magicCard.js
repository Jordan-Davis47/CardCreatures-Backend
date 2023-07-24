const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImageSchema = require("./image");

const MagicCardSchema = new Schema({
	name: {
		type: String,
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
	effect: {
		type: {
			type: String,
			required: true,
		},
		stat: {
			type: String,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	negate: {
		type: Boolean,
	},
	targetRequired: { type: Boolean },
	deck: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Deck",
	},
	type: { type: String, required: true },
	id: { type: String },
});

module.exports = mongoose.model("MagicCard", MagicCardSchema);
