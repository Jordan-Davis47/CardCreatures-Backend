const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const MonsterCard = require("./models/monsterCard");
const MagicCard = require("./models/magicCard");
const Deck = require("./models/deck");
const User = require("./models/User");

const deckRoutes = require("./routes/deck-routes");
const userRoutes = require("./routes/user-routes");
// const gameRoutes = require("./routes/game-routes");

const LeaderboardStat = require("./models/leaderboard");

app.use(jsonParser);
app.use(urlencodedParser);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "https://cardcreatures.vercel.app/");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();
});

app.use("/api/deck", deckRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route", 404);
	throw error;
});

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
