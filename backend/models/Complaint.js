
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteRequest"
        },

        subject: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"],
            default: "Pending"
        },

        resolution: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);
