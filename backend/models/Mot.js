// models/Mot.js
const mongoose = require("mongoose");

const motSchema = new mongoose.Schema(
  {
    mot: { type: String, required: true },
    definition: { type: String, required: true },
    normalized: { type: String, required: true },
    visible: { type: Boolean, default: true },
    normalizedCount: { type: Number, default: 1 },
    anagramMots: { type: [String], default: [] },
    anagramCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index pour accélérer les recherches
motSchema.index({ normalized: 1 });
motSchema.index({ mot: 1 });

module.exports = mongoose.model("ods9-SC-def", motSchema, "ods9-SC-def");
