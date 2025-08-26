// routes/motRoutes.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizAnaController");

router.post("/draw", quizController.draw);
router.post("/guess", quizController.guess);
router.get("/stats", quizController.stats);

module.exports = router;
