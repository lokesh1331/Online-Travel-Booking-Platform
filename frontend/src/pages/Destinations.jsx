import { useState } from "react";
import destinations from "../data/destinations";
import DestinationCard from "../components/DestinationCard";

function Destinations() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("travelFavorites")) || [];
  });

  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavorite = (destination) => {
    const alreadyFavorite = favorites.some(
      (item) => item.id === destination.id
    );

    let updatedFavorites;

    if (alreadyFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item.id !== destination.id
      );
    } else {
      updatedFavorites = [...favorites, destination];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "travelFavorites",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <main className="destinations-page">
      <section className="destinations-header">
        <h1>Explore Destinations</h1>
        <p>Discover amazing places and plan your next adventure.</p>

        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="destination-search"
        />
      </section>

      <section className="destinations-results">
        <h2>Popular Destinations</h2>

        <div className="destination-grid">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onFavorite={handleFavorite}
              />
            ))
          ) : (
            <p>No destinations found. Try another search.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Destinations;