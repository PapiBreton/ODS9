const express = require("express");
const router = express.Router();

const {
  getAllPrefixes,
  getByPrefix,
  getRandom,
} = require("../controllers/prefixController");

router.get("/", getAllPrefixes);
router.get("/random", getRandom);

module.exports = router;
