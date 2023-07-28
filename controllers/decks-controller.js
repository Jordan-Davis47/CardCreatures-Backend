const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const MonsterCard = require("../models/monsterCard");
const MagicCard = require("../models/magicCard");
const Deck = require("../models/deck");
const User = require("../models/User");

const createCard = async (req, res, next) => {
	const { name, atk, def, type, effect, description, deckId, cardId, negate, img } = req.body;

	console.log(req.body);

	let deck;
	try {
		deck = await Deck.findById(deckId).populate("owner");
	} catch (err) {
		const error = new HttpError("Could not find deck for provided ID, please try again", 500);
		return next(error);
	}

	console.log(deck);
	let amountCost;
	if (type === "spell" || type === "trap") {
		if (effect.amount > 500) {
			return new HttpError("Sorry, spell amounts cannot go higher than 500 points", 500);
		}

		amountCost = effect.amount * 2;
	}
	let hasNegate = false;
	if (negate && (type === "spell" || type === "trap")) {
		amountCost = amountCost + 500;
		hasNegate = true;
	}
	console.log("AMOUNT COST:", amountCost);

	let newPoints;
	if (deck.owner.deckPoints - (atk + def) < 0 && type === "monster") {
		return new HttpError("Sorry you dont have enough points for this", 500);
	} else if (type === "monster") {
		newPoints = deck.owner.deckPoints - (atk + def);
	}

	if (deck.owner.deckPoints - amountCost < 0 && (type === "spell" || type === "trap")) {
		return new HttpError("Sorry you dont have enough points for this", 500);
	} else if (type === "spell" || type === "trap") {
		newPoints = deck.owner.deckPoints - amountCost;
	}

	let card;
	if (type === "monster") {
		card = new MonsterCard({
			name,
			atk,
			def,
			cardDescription: description,
			img,
			deck: deckId,
			type: type,
			id: null,
		});
	} else if (type === "spell" || type === "trap") {
		if (effect.type !== "increase") {
			effect.stat = null;
		}
		card = new MagicCard({
			name,
			cardDescription: description,
			img,
			deck: deckId,
			type: type,
			effect: {
				type: effect.type,
				amount: effect.amount,
				stat: effect.stat,
			},
			negate: negate,
			id: null,
		});
	} else {
		return next(new HttpError("Card type unknown, cannot create", 400));
	}

	card.id = card._id.toString();
	if (effect) {
		if (effect.type === "increase") {
			card.targetRequired = true;
		}
	}

	console.log("CARD:", card);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		card.id = card._id.toString();
		await card.save({ session: sess });
		deck.cards.push(card);
		await deck.save({ session: sess });
		const owner = deck.owner;
		owner.deckPoints = newPoints;
		console.log("OWNER::", owner);
		await owner.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log("error::", err);
		const error = new HttpError("Error, Could not create card ", 500);
		return next(error);
	}
	res.status(201).json({ message: "Card Created Successfully" });
};

const updateCard = async (req, res, next) => {
	const cardId = req.params.cid;
	console.log(req.body);

	const { name, atk, def, description, type, effect, negate, img, newDeckPoints } = req.body;

	let card;
	try {
		if (type === "monster") {
			card = await MonsterCard.findById(cardId).populate("deck");
		} else {
			card = await MagicCard.findById(cardId).populate("deck");
		}
	} catch (err) {
		return next(new HttpError("Could not find card for the provided ID", 404));
	}
	console.log(card);

	card.name = name;
	card.cardDescription = description;
	card.type = type;
	if (type === "monster") {
		card.atk = atk;
		card.def = def;
	}
	if (type === "spell" || type === "trap") {
		card.effect = effect;
		card.negate = negate;
		if (effect) {
			if (effect.type === "increase") {
				card.targetRequired = true;
			} else {
				card.effect.stat = null;
			}
		}
	}
	if (img) {
		card.img = img;
	}

	const ownerId = card.deck.owner;

	const owner = await User.findById(ownerId);
	console.log("owner:::", owner);

	console.log(card);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await card.save({ session: sess });
		if (newDeckPoints) {
			owner.deckPoints = newDeckPoints;
			await owner.save({ session: sess });
		}
		sess.commitTransaction();
	} catch (err) {
		return next(new HttpError("Something went wrong, could not update card", 500));
	}

	console.log("SUCCESS");

	res.status(200).json({ message: "Card Updated Successfully!" });
};

const createDeck = async (req, res, next) => {
	const { name, userId } = req.body;

	if (!name || name.trim() === "") {
		return next(new HttpError("Deck requires a name to create", 400));
	}
	if (!userId) {
		return next(new HttpError("No user ID provided", 404));
	}

	const deck = new Deck({
		name,
		owner: userId,
	});

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError("Could not find user for provided ID, please try again", 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await deck.save({ session: sess });
		user.decks.push(deck);
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		return next(new HttpError("Creating deck failed, please try again", 500));
	}

	console.log(user);

	res.status(201).json({ message: "Deck successfully created", deck: deck });
};

const getDecksByUserId = async (req, res, next) => {
	const userId = req.params.uid;
	console.log(req.params);

	let user;
	try {
		user = await User.findById(userId).populate("decks");
	} catch (err) {
		const error = new HttpError("Something went wrong, could not find decks");
		return next(error);
	}

	console.log(user);
	if (user.decks.length === 0) {
		return next(new HttpError("Sorry, there are no decks"));
	}

	if (!user || user.decks.length === 0) {
		return next(new HttpError("Sorry, could not find decks for the provided ID"));
	}
	//create an array containing the deck name and deck ID//
	const decks = [];
	user.decks.map((deck) => {
		decks.push({
			name: deck.name,
			id: deck._id,
			length: deck.cards.length,
		});
	});
	res.json({
		decks,
	});
};

const getCardsByDeckId = async (req, res, next) => {
	const { did: deckId } = req.params;

	let monsterCards;
	let magicCards;
	try {
		magicCards = await Deck.findById(deckId).populate({ path: "cards", model: "MagicCard" });
	} catch (err) {
		return next(new HttpError("Could not find deck for the provided ID", 404));
	}

	try {
		monsterCards = await Deck.findById(deckId).populate({ path: "cards", model: "MonsterCard" });
	} catch (err) {
		console.log(err);
	}

	const fullDeck = magicCards.cards.concat(monsterCards.cards);
	console.log(fullDeck);

	res.status(200).json({ cards: fullDeck, deckName: monsterCards.name });
	// res.status(200);
};

const addCardToDeck = async (req, res, next) => {
	const { card, deckId } = req.body;

	let cardToAdd;
	if (card.type === "monster") {
		cardToAdd = new MonsterCard({
			name: card.name,
			atk: card.atk,
			def: card.def,
			description: card.description,
		});
	} else {
		return next(HttpError("Card type unknown, cannot create", 400));
	}

	let deck;
	try {
		deck = await Deck.findById(deckId);
		deck.cards.push(cardToAdd);
		deck.save();
	} catch (err) {
		const error = new HttpError("Failed to add card to deck, something went wrong", 400);
		return next(error);
	}

	res.status(201).json({ message: "Card Successfully Added To Deck", cards: deck.cards });
};

const deleteCard = async (req, res, next) => {
	const { cid } = req.params;

	let card;
	try {
		card = await MonsterCard.findById(cid).populate("deck");
	} catch (err) {
		return next(HttpError("Could not find card for provided ID", 404));
	}
	console.log(card);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await card.deleteOne({ session: sess });
		card.deck.cards.pull(card);
		await card.deck.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		return next(new HttpError("Something went wrong, please try again", 400));
	}

	res.status(200).json({ message: "Card Successfully Deleted!" });
};

const deleteDeck = async (req, res, next) => {
	const { did: deckId } = req.params;
	console.log(req.params);

	let deck;
	try {
		deck = await Deck.findById(deckId).populate("owner");
	} catch (err) {
		return next(new HttpError("Something went wrong, please try again", 400));
	}

	console.log("deck:", deck);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await deck.deleteOne({ session: sess });
		deck.owner.decks.pull(deck);
		await deck.owner.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		return next(new HttpError("Something went wrong completing this transaction, could not delete deck", 500));
	}

	res.status(200).json({ message: "Deck Successfully Deleted" });
};

module.exports = {
	createCard,
	createDeck,
	addCardToDeck,
	getDecksByUserId,
	deleteDeck,
	deleteCard,
	getCardsByDeckId,
	updateCard,
};
