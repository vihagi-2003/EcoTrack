
const M = require("../models/Complaint");

exports.list = async (q, s) => {
  try {
    const complaints = await M.find(
      q.user.role === "Resident"
        ? { user: q.user._id }
        : {}
    )
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    s.json(complaints);
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};

exports.create = async (q, s) => {
  try {
    const complaint = await M.create({
      ...q.body,
      user: q.user._id,
    });

    s.status(201).json(complaint);
  } catch (e) {
    s.status(400).json({ message: e.message });
  }
};

exports.update = async (q, s) => {
  try {
    const complaint = await M.findByIdAndUpdate(
      q.params.id,
      q.body,
      { new: true }
    );

    if (!complaint) {
      return s.status(404).json({
        message: "Complaint not found",
      });
    }

    s.json(complaint);
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};

exports.remove = async (q, s) => {
  try {
    const complaint = await M.findByIdAndDelete(
      q.params.id
    );

    if (!complaint) {
      return s.status(404).json({
        message: "Complaint not found",
      });
    }

    s.json({
      message: "Complaint deleted successfully",
    });
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};
