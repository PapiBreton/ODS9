const mongoose = require("mongoose");
const anagrammesSchema = new mongoose.Schema({
  mots: [{ type: String, required: true }],
  normalized: { type: String, required: true },
});
anagrammesSchema.index({ normalized: 1 });

module.exports = mongoose.model(
  "anagramGroups",
  anagrammesSchema,
  "anagramGroups"
);
