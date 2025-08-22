const express = require("express");
const router = express.Router();
const { getRajouts } = require("../controllers/dicoCompletController");

router.get("/:mot", getRajouts);
module.exports = router;
