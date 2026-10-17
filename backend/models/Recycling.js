
const mongoose = require("mongoose");

const recyclingSchema = new mongoose.Schema(
    {
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteRequest"
        },

        category: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        unit: {
            type: String,
            default: "kg"
        },

        partner: String,

        status: {
            type: String,
            enum: [
                "Received",
                "Processing",
                "Recycled",
                "Completed"
            ],
            default: "Received"
        },

        collectedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Recycling", recyclingSchema);
