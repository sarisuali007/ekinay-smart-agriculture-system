const mongoose = require("mongoose");

const autoAlertLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    alertType: {
      type: String,
      required: true,
    },
    slotKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

autoAlertLogSchema.index(
  { userId: 1, fieldId: 1, alertType: 1, slotKey: 1 },
  { unique: true }
);

module.exports = mongoose.model("AutoAlertLog", autoAlertLogSchema);