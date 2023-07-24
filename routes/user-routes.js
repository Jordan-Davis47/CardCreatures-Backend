const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.post("/updateStats", usersController.updateStats);

router.get("/leaderboard", usersController.getLeaderboard);

router.get("/deckPoints/:uid", usersController.getDeckPoints);

module.exports = router;
