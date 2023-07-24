const express = require("express");

const decksController = require("../controllers/decks-controller");

const router = express.Router();

router.post("/createCard", decksController.createCard);

router.post("/createDeck", decksController.createDeck);

router.post("/card", decksController.addCardToDeck);

router.get("/user/:uid", decksController.getDecksByUserId);

router.get("/:did", decksController.getCardsByDeckId);

router.patch("/card/:cid", decksController.updateCard);

router.delete("/card/:cid", decksController.deleteCard);

router.delete("/:did", decksController.deleteDeck);

module.exports = router;
