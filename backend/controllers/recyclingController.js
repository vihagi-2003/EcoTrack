
const M = require("../models/Recycling");

exports.list = async (q, s) => {
  try {
    const items = await M.find()
      .populate("request")
      .sort({ createdAt: -1 });

    s.json(items);
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};

exports.create = async (q, s) => {
  try {
    const item = await M.create(q.body);
    s.status(201).json(item);
  } catch (e) {
    s.status(400).json({ message: e.message });
  }
};

exports.update = async (q, s) => {
  try {
    const item = await M.findByIdAndUpdate(
      q.params.id,
      q.body,
      { new: true }
    );

    if (!item) {
      return s.status(404).json({
        message: "Record not found",
      });
    }

    s.json(item);
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};

exports.remove = async (q, s) => {
  try {
    const item = await M.findByIdAndDelete(q.params.id);

    if (!item) {
      return s.status(404).json({
        message: "Record not found",
      });
    }

    s.json({ message: "Deleted successfully" });
  } catch (e) {
    s.status(500).json({ message: e.message });
  }
};
