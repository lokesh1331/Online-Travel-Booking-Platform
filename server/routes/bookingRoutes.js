
const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

// Create a booking
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create booking.",
      error: error.message,
    });
  }
});

// Cancel a booking
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking." });
  }
});

module.exports = router;
