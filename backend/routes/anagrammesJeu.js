const express = require("express");
const router = express.Router();
const { getInitJeu } = require("../controllers/anagrammesJeuController");

// Route pour récupérer un normalized aléatoire de 8 lettres
router.get("/initJeu", getInitJeu);

module.exports = router;
