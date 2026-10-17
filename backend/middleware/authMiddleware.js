
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify user authentication
exports.protect = async (req, res, next) => {
    try {
        const h = req.headers.authorization;

        if (!h?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const d = jwt.verify(
            h.split(" ")[1],
            process.env.JWT_SECRET
        );

        req.user = await User.findById(d.id)
            .select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        next();
    } catch (e) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// Check user role
exports.authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }

    return roles.includes(req.user.role)
        ? next()
        : res.status(403).json({
            message: "Access denied"
        });
};
