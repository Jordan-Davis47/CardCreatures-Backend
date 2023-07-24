const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
	name: String,
	cards: [
		{
			type: Schema.Types.ObjectId,
			ref: "MonsterCard",
		},
		{
			type: Schema.Types.ObjectId,
			ref: "MagicCard",
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
});

module.exports = mongoose.model("Deck", DeckSchema);
