const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    bookingType: {
      type: String,
      enum: ["flight", "hotel", "cab"],
      required: true,
    },

    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed",
    },

    bookingDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-IN"),
    },

    travelDate: {
      type: String,
      default: "",
    },

    // Flight details
    airline: String,
    flightNumber: String,
    from: String,
    to: String,
    departure: String,
    arrival: String,
    duration: String,

    // Hotel details
    name: String,
    location: String,
    roomType: String,
    rating: Number,

    // Cab details
    provider: String,
    vehicle: String,
    seats: Number,

    // Common price
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);