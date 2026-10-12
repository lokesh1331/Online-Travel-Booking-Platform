function FlightCard({ flight, onBook }) {
  return (
    <div className="flight-card">

      <div className="flight-airline">
        <div className="airline-icon">✈️</div>

        <div>
          <h3>{flight.airline}</h3>
          <p>{flight.flightNumber}</p>
        </div>
      </div>

      <div className="flight-time">
        <strong>{flight.departure}</strong>
        <span>{flight.from}</span>
      </div>

      <div className="flight-duration">
        <span>{flight.duration}</span>
        <div className="flight-line">
          ─────────✈
        </div>
        <small>{flight.stops}</small>
      </div>

      <div className="flight-time">
        <strong>{flight.arrival}</strong>
        <span>{flight.to}</span>
      </div>

      <div className="flight-price">
        <small>Starting from</small>
        <strong>₹{flight.price.toLocaleString("en-IN")}</strong>

        <button onClick={() => onBook(flight)}>
          Book Now
        </button>
      </div>

    </div>
  );
}

export default FlightCard;