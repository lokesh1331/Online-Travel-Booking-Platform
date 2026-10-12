function CabCard({ cab, onBook }) {
  return (
    <div className="cab-card">
      <div className="cab-card-top">
        <div>
          <h3>{cab.provider}</h3>
          <p className="cab-location">📍 {cab.location}</p>
        </div>

        <span className="cab-vehicle">
          🚕 {cab.vehicle}
        </span>
      </div>

      <p>
        <strong>Seats:</strong> {cab.seats}
      </p>

      <div className="cab-features">
        {cab.features.map((feature, index) => (
          <span key={index}>{feature}</span>
        ))}
      </div>

      <div className="cab-card-bottom">
        <div>
          <span>Starting from</span>
          <strong>₹{cab.price}</strong>
          <small>/ ride</small>
        </div>

        <button onClick={() => onBook(cab)}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CabCard;