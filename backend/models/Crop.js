const mongoose = require("mongoose");

const ALLOWED_CROPS = ["domates", "biber", "salatalık", "fasulye"];

const cropSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
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

    sowingDate: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);