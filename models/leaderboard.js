const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaderboardStatSchema = new Schema({
	player: String,
	wins: Number,
	score: Number,
});

module.exports = mongoose.model("LeaderboardStat", LeaderboardStatSchema);
