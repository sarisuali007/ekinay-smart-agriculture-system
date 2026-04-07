const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);