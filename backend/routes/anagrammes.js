const express = require("express");
const router = express.Router();
const { getAnagrammes } = require("../controllers/anagrammesController");

router.get("/:mot", getAnagrammes);
module.exports = router;
