
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
  res.send("TravelGo Backend is running!");
});
// Booking API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`TravelGo server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();
