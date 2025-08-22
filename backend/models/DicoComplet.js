const mongoose = require("mongoose");

const dicoCompletSchema = new mongoose.Schema({
  mot: { type: Array, required: true },
  normalized: { type: String, required: true },
});

dicoCompletSchema.index({ mot: 1 });

module.exports = mongoose.model(
  "Ods9_complet_SansDefinition_2a15",
  dicoCompletSchema,
  "Ods9_complet_SansDefinition_2a15"
);
