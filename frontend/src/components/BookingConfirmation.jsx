function BookingConfirmation({ flight, onClose }) {
  return (
    <div className="booking-overlay">

      <div className="booking-modal">

        <button
          className="close-booking"
          onClick={onClose}
        >
          ×
        </button>

        <div className="booking-success">
          ✓
        </div>

        <h2>Booking Confirmed!</h2>

        <p className="booking-subtitle">
          Your flight has been successfully reserved.
        </p>

        <div className="booking-details">

          <div>
            <span>Airline</span>
            <strong>{flight.airline}</strong>
          </div>

          <div>
            <span>Flight</span>
            <strong>{flight.flightNumber}</strong>
          </div>

          <div>
            <span>Route</span>
            <strong>
              {flight.from} → {flight.to}
            </strong>
          </div>

          <div>
            <span>Departure</span>
            <strong>{flight.departure}</strong>
          </div>

          <div>
            <span>Arrival</span>
            <strong>{flight.arrival}</strong>
          </div>

          <div>
            <span>Total Fare</span>
            <strong>
              ₹{flight.price.toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

        <div className="booking-reference">
          <span>Booking Reference</span>
          <strong>
            {flight.bookingReference}
          </strong>
        </div>

        <button
          className="booking-done-btn"
          onClick={onClose}
        >
          Done
        </button>

      </div>

    </div>
  );
}

export default BookingConfirmation;