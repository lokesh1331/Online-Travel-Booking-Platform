function HotelCard({ hotel, onBook }) {
  return (
    <div className="hotel-card">
      <div className="hotel-card-top">
        <h3>{hotel.name}</h3>
        <span className="hotel-rating">⭐ {hotel.rating}</span>
      </div>

      <p className="hotel-location">📍 {hotel.location}</p>

      <p>
        <strong>Room:</strong> {hotel.roomType}
      </p>

      <div className="hotel-facilities">
        {hotel.facilities.map((facility, index) => (
          <span key={index}>{facility}</span>
        ))}
      </div>

      <div className="hotel-card-bottom">
        <div>
          <span>Starting from</span>
          <strong>₹{hotel.price}</strong>
          <small>/ night</small>
        </div>

        <button onClick={() => onBook(hotel)}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default HotelCard;