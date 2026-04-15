const mongoose = require("mongoose");

const ALLOWED_CROPS = ["Domates", "Biber", "Fasulye", "Salatalık"];

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      enum: ALLOWED_CROPS,
    },

    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },

    showingDate: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);