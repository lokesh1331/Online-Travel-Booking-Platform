const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const Package = require("../models/Package");

const router = express.Router();

// Get all travel packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    console.error("Fetch packages error:", error.message);
    res.status(500).json({ message: "Failed to fetch travel packages." });
  }
});



 // Update a travel package (admin only)
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, destination, description, price, duration } = req.body;

      if (
        !name?.trim() ||
        !destination?.trim() ||
        !description?.trim() ||
        !duration?.trim() ||
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          message: "Please provide valid details for every package field.",
        });
      }

      const updatedPackage = await Package.findByIdAndUpdate(
        req.params.id,
        {
          name,
          destination,
          description,
          price: Number(price),
          duration,
        },
        { new: true, runValidators: true }
      );

      if (!updatedPackage) {
        return res.status(404).json({
          message: "Travel package not found.",
        });
      }

      res.json(updatedPackage);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid package ID.",
        });
      }

      console.error("Update package error:", error.message);
      res.status(500).json({
        message: "Failed to update travel package.",
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deletedPackage = await Package.findByIdAndDelete(req.params.id);

      if (!deletedPackage) {
        return res.status(404).json({
          message: "Travel package not found.",
        });
      }

      res.json({ message: "Travel package deleted successfully." });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid package ID.",
        });
      }

      console.error("Delete package error:", error.message);
      res.status(500).json({
        message: "Failed to delete travel package.",
      });
    }
  }
);

module.exports = router;
