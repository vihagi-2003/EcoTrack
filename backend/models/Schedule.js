
const mongoose = require("mongoose");

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

module.exports = mongoose.model("Schedule", scheduleSchema);
