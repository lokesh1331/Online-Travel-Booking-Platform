function DestinationCard({ destination, onFavorite }) {
  return (
    <div className="destination-card">
      <div className="destination-card-icon">🌍</div>

      <h3>{destination.name}</h3>

      <p className="destination-state">
        📍 {destination.state}
      </p>

      <p className="destination-description">
        {destination.description}
      </p>

      <div className="destination-best-time">
        <strong>Best time to visit:</strong>
        <p>{destination.bestTime}</p>
      </div>

      <button
        className="destination-favorite-btn"
        onClick={() => onFavorite(destination)}
      >
        ❤️ Add to Favorites
      </button>
    </div>
  );
}

export default DestinationCard;