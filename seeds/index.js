const express = require("express");
const app = express();
const mongoose = require("mongoose");
const rankings = require("./rankings");
const users = require("./users");
const Deck = require("../models/deck");
const LeaderboardStat = require("../models/leaderboard");
const User = require("../models/User");
const MonsterCard = require("../models/monsterCard");
const { ObjectID } = require("bson");

const decks = ["Deck 1", "Deck 2", "Deck 3"];
const cards = [
	{
		name: "name",
		atk: 1000,
		def: 1000,
		description: "description",
	},
	{
		name: "name",
		atk: 1000,
		def: 1000,
		description: "description",
	},
	{
		name: "name",
		atk: 1000,
		def: 1000,
		description: "description",
	},
];

mongoose
	.connect("mongodb+srv://JordanDavis47:Oblivion4799@cluster0.dgnnmdu.mongodb.net/monster-duels?retryWrites=true&w=majority")
	.then(() => {
		app.listen(9000, () => {
			console.log("listening on 9000");
		});
	})
	.catch((err) => {
		console.log(err);
	});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

// const seedDb = async () => {
// 	await LeaderboardStat.deleteMany({});
// 	for (let i = 0; i < rankings.length; i++) {
// 		const leaderboardStat = new LeaderboardStat({
// 			player: rankings[i].player,
// 			wins: rankings[i].wins,
// 			score: rankings[i].score,
// 		});

// 		await leaderboardStat.save();
// 	}
// };

// const seedDb = async () => {
// 	await User.deleteMany({});
// 	for (let i = 0; i < users.length; i++) {
// 		const user = new User({
// 			username: users[i].username,
// 			email: users[i].email,
// 			password: users[i].password,
// 			stats: users[i].stats,
// 			decks: users[i].decks,
// 			deckPoints: users[i].deckPoints,
// 		});

// 		await user.save();
// 	}
// };

const seedDb = async () => {
	// for (let i = 0; i < decks.length; i++) {
	// 	const deck = new Deck({ name: decks[i] });
	// 	deck.save();
	// }
	// const deck = Deck.find({ name: "Deck 1" });
	// for (let i = 0; i > cards.length; i++) {
	// 	deck.cards.push(cards[i]);
	// 	deck.save();
	// }

	await MonsterCard.deleteMany({});
	await Deck.deleteMany({});
	const user = await User.findById("63b1ae359f090d24153bacc2");
	user.decks.owner.pull("63e0d6dd205b5d98dd49a93c");
};

seedDb().then(() => {
	console.log("data uploaded");
});
