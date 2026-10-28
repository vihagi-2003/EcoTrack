const M = require("../models/Recycling");

exports.list = async (q, s) => {
  try {
    const items = await M.find()
      .populate("request")
      .sort({ createdAt: -1 });

    return s.status(200).json(items);
  } catch (e) {
    return s.status(500).json({ message: e.message });
  }
};

exports.create = async (q, s) => {
  try {
    const item = await M.create(q.body);

    return s.status(201).json(item);
  } catch (e) {
    return s.status(400).json({ message: e.message });
  }
};

exports.update = async (q, s) => {
  try {
    const item = await M.findByIdAndUpdate(
      q.params.id,
      q.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return s.status(404).json({
        message: "Record not found",
      });
    }

    return s.status(200).json(item);
  } catch (e) {
    return s.status(400).json({ message: e.message });
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

    return s.status(200).json({
      message: "Deleted successfully",
    });
  } catch (e) {
    return s.status(500).json({ message: e.message });
  }
};