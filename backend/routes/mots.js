const express = require("express");
const router = express.Router();
const {
  getAllMots,
  getMot,
  getDefinition,
  cacherMot,
} = require("../controllers/motsController");

router.get("/", getAllMots);
router.get("/:mot", getMot);
router.get("/definition/:mot", getDefinition);
router.post("/:id/cacher", cacherMot);

module.exports = router;
