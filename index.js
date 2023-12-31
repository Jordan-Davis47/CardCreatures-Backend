const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const cors = require("cors");
const HttpError = require("./models/http-error");

const deckRoutes = require("./routes/deck-routes");
const userRoutes = require("./routes/user-routes");

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());

app.use((req, res, next) => {
	console.log("set headers log");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Author, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

	next();
});

app.use("/api/deck", deckRoutes);
app.use("/api/users", userRoutes);

mongoose
	.connect(`${process.env.DB_URL}`)
	.then(() => {
		app.listen(process.env.PORT || 9000, () => {
			console.log(`listening on ${process.env.port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
