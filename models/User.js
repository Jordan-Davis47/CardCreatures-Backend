const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: {
		type: String,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	decks: [
		{
			type: Schema.Types.ObjectId,
			ref: "Deck",
		},
	],
	deckPoints: {
		type: Number,
	},
	stats: {
		wins: {
			type: Number,
		},
		points: {
			type: Number,
		},
	},
});

module.exports = mongoose.model("User", UserSchema);
