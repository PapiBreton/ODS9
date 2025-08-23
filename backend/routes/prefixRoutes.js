const express = require("express");
const router = express.Router();
const {
  getAllPrefixes,
  getByPrefix,
  getRandom,
  updatePrefix,
  deletePrefix,
  getByInitialLetter,
  getLetterCounts,
} = require("../controllers/prefixController");

router.get("/counts", getLetterCounts); // 👈 doit venir AVANT
router.get("/random", getRandom);
router.get("/alpha/:letter", getByInitialLetter);
router.put("/:id", updatePrefix);
router.delete("/:id", deletePrefix);
router.get("/:prefix", getByPrefix);

module.exports = router;
