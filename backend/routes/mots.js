const express = require("express");
const router = express.Router();
const { getAllMots, getMot } = require("../controllers/motsController");

router.get("/", getAllMots);
router.get("/:mot", getMot);

module.exports = router;
