
const User = require("../models/User");
const R = require("../models/WasteRequest");
const C = require("../models/Complaint");
const X = require("../models/Recycling");

exports.summary = async (req, res) => {
  try {
    const [
      users,
      requests,
      complaints,
      recycling,
      pending,
      completed,
    ] = await Promise.all([
      User.countDocuments(),

      R.countDocuments(),

      C.countDocuments(),

      X.countDocuments(),

      // Match Pending regardless of capitalization
      R.countDocuments({
        status: {
          $regex: /^(pending|requested|new)$/i,
        },
      }),

      // Match completed collection statuses
      R.countDocuments({
        status: {
          $regex: /^(completed|complete|collected)$/i,
        },
      }),
    ]);

    res.status(200).json({
      users,
      requests,
      complaints,
      recycling,
      pending,
      completed,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    res.status(500).json({
      message: "Failed to load dashboard summary",
      error: error.message,
    });
  }
};
