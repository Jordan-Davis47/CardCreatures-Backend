require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const signup = async (req, res, next) => {
	const { email, username, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError("Signing up failed, please try again later", 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError("User already exists, please login instead", 422);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError("User already exists, please login instead", 422);
		return next(error);
	}

	const createdUser = new User({
		username,
		email,
		password: hashedPassword,
		decks: [],
		deckPoints: 25000,
		stats: {
			wins: 0,
			points: 0,
		},
	});

	createdUser.id = createdUser._id.toString();
	console.log(createdUser);

	try {
		await createdUser.save();
	} catch (err) {
		console.log(err);
		const error = new HttpError("Something went wrong, could not sign up", 500);
		return next(error);
	}

	console.log("KEY:", process.env.JWT_KEY);

	let token;
	try {
		token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: "1h" });
	} catch (err) {
		console.log(err);
		const error = new HttpError("Something went wrong", 500);
		return next(error);
	}

	res.status(201).json({ user: { id: createdUser.id, username: createdUser.username, token: token } });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError("Could not find account with those details", 404);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		console.log(err);
		const error = new HttpError("Invalid credentials, could not log you in", 403);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError("Invalid credentials provided, check your inputs", 403);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign({ userId: existingUser.id, username: existingUser.username, email: existingUser.email, token: token }, process.env.JWT_KEY, { expiresIn: "1hr" });
	} catch (err) {
		console.log(err);
		const error = new HttpError("Logging in failed", 500);
		return next(error);
	}

	res.status(201).json({ message: "Logged in Successfully", user: { id: existingUser.id, username: existingUser.username, token: token } });
};

const getLeaderboard = async (req, res, next) => {
	const users = await User.find({});
	const stats = [];
	console.log(users);
	for (let i = 0; i < users.length; i++) {
		const userStats = {
			name: users[i].username,
			wins: users[i].stats.wins,
			score: users[i].stats.points,
		};
		stats.push(userStats);
	}
	console.log(stats);

	stats.sort((a, b) => {
		if (a.score < b.score) {
			return 1;
		}
		if (a.score > b.score) {
			return -1;
		}
		return 0;
	});

	res.send(stats);
};

const getDeckPoints = async (req, res, next) => {
	const { uid } = req.params;
	console.log("get deck points hit");

	let user;
	try {
		user = await User.findById(uid);
	} catch (err) {
		return next(new HttpError("Could not find user for provided ID", 404));
	}

	const deckPoints = user.deckPoints;

	res.status(200).json({ deckPoints });
};

const updateStats = async (req, res, next) => {
	const { uid, win } = req.body;
	console.log(req.body);
	let deckPoints;
	let points;
	if (win) {
		deckPoints = 700;
		points = 500;
		winCount = 1;
	} else if (!win) {
		deckPoints = 300;
		points = 100;
	}

	let user;
	try {
		user = await User.findById(uid);
	} catch (err) {
		return next(new HttpError("Could not find user for provided ID", 404));
	}
	console.log(user);
	console.log(deckPoints, points);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		console.log(user.deckPoints);
		user.deckPoints = user.deckPoints + deckPoints;
		console.log(user.deckPoints);
		console.log(user.stats.points, points);
		user.stats.points = user.stats.points + points;
		console.log(user.stats.points);
		if (win) {
			user.stats.wins = user.stats.wins + 1;
		}
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		return next(new HttpError("Something went wrong, please try again", 400));
	}

	res.status(200).json({ message: "Successfully Updated Stats" });
};

module.exports = {
	signup,
	getLeaderboard,
	login,
	getDeckPoints,
	updateStats,
};
