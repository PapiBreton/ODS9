const mongoose = require("mongoose");

const motSchema = new mongoose.Schema({
  mot: { type: String, required: true },
  definition: { type: String, required: true },
  normalized: { type: String, required: true },
});

module.exports = mongoose.model("ods9-SC-def", motSchema, "ods9-SC-def");
