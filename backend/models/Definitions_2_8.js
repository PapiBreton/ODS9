// models/definitions_2_8.js

const mongoose = require("mongoose");

const definitionsSchema = new mongoose.Schema(
  {
    mot: { type: String, required: true },
    definition: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

definitionsSchema.index({ definition: 1 });

module.exports = mongoose.model(
  "ods9-def-2-a-8",
  definitionsSchema,
  "ods9-def-2-a-8"
);
