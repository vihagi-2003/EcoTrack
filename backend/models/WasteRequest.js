
const mongoose = require("mongoose");

const wasteRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    wasteType: {
      type: String,
      required: true
    },

    description: String,

    location: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    preferredDate: Date,

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Collected",
        "Completed",
        "Cancelled"
      ],
      default: "Pending"
    },

    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "WasteRequest",
  wasteRequestSchema
);
