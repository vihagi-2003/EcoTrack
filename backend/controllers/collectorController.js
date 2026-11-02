const User = require("../models/User");

exports.list = async (req, res) => {
    try {
        const collectors = await User.find({ role: "Collector" })
            .select("-password")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: collectors.length,
            collectors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch collectors",
            error: error.message
        });
    }
};