
const Complaint = require("../models/Complaint");

exports.list = async (req, res) => {
  try {
    const filter =
      req.user.role === "Resident"
        ? { user: req.user._id }
        : {};

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .populate("request")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { subject, description, priority, request } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        message: "Subject and description are required",
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      subject,
      description,
      priority: priority || "Medium",
      ...(request ? { request } : {}),
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const allowedFields = [
      "subject",
      "description",
      "priority",
      "status",
      "resolution",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("request");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
