
const M = require("../models/WasteRequest");

// Get all requests
exports.list = async (q, s) => {
  try {
    const filter =
      q.user.role === "Resident"
        ? { user: q.user._id }
        : {};

    const requests = await M.find(filter)
      .populate("user", "name email")
      .populate("collector", "name email")
      .sort({ createdAt: -1 });

    return s.status(200).json(requests);
  } catch (e) {
    return s.status(500).json({
      message: e.message
    });
  }
};

// Create a new request
exports.create = async (q, s) => {
  try {
    const request = await M.create({
      ...q.body,
      user: q.user._id
    });

    return s.status(201).json(request);
  } catch (e) {
    return s.status(400).json({
      message: e.message
    });
  }
};

// Get a single request
exports.get = async (q, s) => {
  try {
    const request = await M.findById(q.params.id)
      .populate("user", "name email")
      .populate("collector", "name email");

    if (!request) {
      return s.status(404).json({
        message: "Request not found"
      });
    }

    // Residents can only view their own requests
    if (
      q.user.role === "Resident" &&
      String(request.user?._id || request.user) !==
        String(q.user._id)
    ) {
      return s.status(403).json({
        message: "You can only view your own requests"
      });
    }

    return s.status(200).json(request);
  } catch (e) {
    return s.status(500).json({
      message: e.message
    });
  }
};

// Update a request - Admin only
exports.update = async (q, s) => {
  try {
    if (q.user.role !== "Admin") {
      return s.status(403).json({
        message: "Only Admin can update requests"
      });
    }

    const request = await M.findByIdAndUpdate(
      q.params.id,
      q.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!request) {
      return s.status(404).json({
        message: "Request not found"
      });
    }

    return s.status(200).json(request);
  } catch (e) {
    return s.status(500).json({
      message: e.message
    });
  }
};

// Delete a request - Admin only
exports.remove = async (q, s) => {
  try {
    if (q.user.role !== "Admin") {
      return s.status(403).json({
        message: "Only Admin can delete requests"
      });
    }

    const request = await M.findById(q.params.id);

    if (!request) {
      return s.status(404).json({
        message: "Request not found"
      });
    }

    await M.findByIdAndDelete(q.params.id);

    return s.status(200).json({
      message: "Request deleted successfully"
    });
  } catch (e) {
    return s.status(500).json({
      message: e.message
    });
  }
};
