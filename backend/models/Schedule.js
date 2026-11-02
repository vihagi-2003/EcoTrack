
const mongoose = require("mongoose");

// Create schedule schema
const scheduleSchema = new mongoose.Schema(
    {
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteRequest"
        },

        collector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        area: String,
        date: Date,
        time: String,
        route: String,

        // Schedule status
        status: {
            type: String,
            enum: [
                "Scheduled",
                "In Progress",
                "Completed",
                "Cancelled"
            ],
            default: "Scheduled"
        }
    },
    {
        timestamps: true
    }
);

// Export Schedule model
module.exports = mongoose.model("Schedule", scheduleSchema);
