const mongoose = require("mongoose");

const prefixSchema = new mongoose.Schema({
  prefix: { type: String, required: true },
  word: { type: String, required: true },
  solution: { type: String, required: true },
});

module.exports = mongoose.model("Prefix", prefixSchema);
