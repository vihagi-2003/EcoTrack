
const M = require("../models/Schedule");

// Get all schedules
exports.list = async (req, res) => {
    res.json(
        await M.find()
            .populate("collector", "name email")
            .populate("request")
            .sort({ date: 1 })
    );
};

// Create a schedule
exports.create = async (req, res) => {
    try {
        res.status(201).json(await M.create(req.body));
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

// Update a schedule
exports.update = async (req, res) => {
    const x = await M.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!x) {
        return res.status(404).json({
            message: "Schedule not found"
        });
    }

    res.json(x);
};

// Delete a schedule
exports.remove = async (req, res) => {
    const x = await M.findByIdAndDelete(req.params.id);

    if (!x) {
        return res.status(404).json({
            message: "Schedule not found"
        });
    }

    res.json({ message: "Schedule deleted" });
};
