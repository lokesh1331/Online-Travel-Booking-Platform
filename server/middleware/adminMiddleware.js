
const User = require("../models/User");

async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Administrator permission required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error.message);

    return res.status(500).json({
      message: "Unable to verify administrator permissions.",
    });
  }
}

module.exports = adminMiddleware;
