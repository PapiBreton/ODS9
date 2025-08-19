const mongoose = require("mongoose");
const anagrammesSchema = new mongoose.Schema({
  mots: { type: Array, required: true },
  normalized: { type: String, required: true },
});

module.exports = mongoose.model(
  "anagramGroups",
  anagrammesSchema,
  "anagramGroups"
);
