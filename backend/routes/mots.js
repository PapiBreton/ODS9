const express = require("express");
const router = express.Router();
const {
  getAllMots,
  getMot,
  cacherMot,
} = require("../controllers/motsController");

router.get("/", getAllMots);
router.get("/:mot", getMot);
router.post("/:id/cacher", cacherMot);

module.exports = router;
