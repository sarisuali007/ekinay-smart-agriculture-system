const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    areaM2: { type: Number, default: 0 },
    isGreenhouse: { type: Boolean, default: false },
    polygon: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);