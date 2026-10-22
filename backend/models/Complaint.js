
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
            ref: "WasteRequest",
            default: null
        },

        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
            minlength: [3, "Subject must be at least 3 characters"]
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters"]
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

        resolution: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);
