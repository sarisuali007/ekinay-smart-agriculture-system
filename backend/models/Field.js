const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    areaM2: { type: Number, default: 0 },
    isGreenhouse: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);