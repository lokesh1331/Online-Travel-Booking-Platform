import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/bookings";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load bookings.");
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(
        "Unable to load bookings. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_URL}/${bookingId}/cancel`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking.");
      }

      const updatedBooking = await response.json();

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === updatedBooking._id
            ? updatedBooking
            : booking
        )
      );
    } catch (err) {
      setError("Unable to cancel the booking. Please try again.");
    }
  };

  return (
    <main className="bookings-page">
      <div className="bookings-header">
        <h1>My Trips</h1>
        <p>View and manage your travel bookings.</p>
      </div>

      {loading ? (
        <div className="no-bookings">
          <p>Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="no-bookings">
          <p>{error}</p>
          <button onClick={fetchBookings}>Try Again</button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No bookings yet</h2>
          <p>Your confirmed bookings will appear here.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-type">
                {booking.bookingType === "hotel"
                  ? "🏨 Hotel Booking"
                  : booking.bookingType === "cab"
                  ? "🚕 Cab Booking"
                  : "✈️ Flight Booking"}
              </div>

              {/* Flight details */}
              {booking.bookingType === "flight" && (
                <>
                  <h2>{booking.airline}</h2>
                  <p>
                    <strong>Flight:</strong> {booking.flightNumber || "—"}
                  </p>
                  <p>
                    <strong>Route:</strong>{" "}
                    {booking.from || "—"} → {booking.to || "—"}
                  </p>
                  <p>
                    <strong>Departure:</strong> {booking.departure || "—"}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {booking.arrival || "—"}
                  </p>
                  <p>
                    <strong>Travel Date:</strong> {booking.travelDate || "—"}
                  </p>
                </>
              )}

              {/* Hotel details */}
              {booking.bookingType === "hotel" && (
                <>
                  <h2>{booking.name}</h2>
                  <p>
                    <strong>Location:</strong> {booking.location || "—"}
                  </p>
                  <p>
                    <strong>Room:</strong> {booking.roomType || "—"}
                  </p>
                  <p>
                    <strong>Travel Date:</strong> {booking.travelDate || "—"}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{booking.price} / night
                  </p>
                </>
              )}

              {/* Cab details */}
              {booking.bookingType === "cab" && (
                <>
                  <h2>{booking.provider}</h2>
                  <p>
                    <strong>Location:</strong> {booking.location || "—"}
                  </p>
                  <p>
                    <strong>Vehicle:</strong> {booking.vehicle || "—"}
                  </p>
                  <p>
                    <strong>Seats:</strong> {booking.seats || "—"}
                  </p>
                  <p>
                    <strong>Travel Date:</strong> {booking.travelDate || "—"}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{booking.price} / ride
                  </p>
                </>
              )}

              <div className="booking-footer">
                <div>
                  <p>
                    <strong>Booking Reference:</strong>{" "}
                    {booking.bookingReference}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        booking.status === "Cancelled"
                          ? "status-cancelled"
                          : "status-confirmed"
                      }
                    >
                      {booking.status || "Confirmed"}
                    </span>
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{booking.price}
                  </p>
                </div>

                {booking.status !== "Cancelled" && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Bookings;
