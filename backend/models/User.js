
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "Resident",
                "Collector",
                "Admin",
                "Recycling Partner"
            ],
            default: "Resident"
        },

        phone: String,
        address: String,

        status: {
            type: String,
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
