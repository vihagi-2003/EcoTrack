const User = require("../models/User");

exports.list = async (req, res) => {
    try {
        const collectors = await User.find({ role: "Collector" })
            .select("-password")
            .sort({ name: 1 });

        res.status(200).json(collectors);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch collectors"
        });
    }
};