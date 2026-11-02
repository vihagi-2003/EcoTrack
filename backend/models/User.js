const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
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

        phone: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "Blocked"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);