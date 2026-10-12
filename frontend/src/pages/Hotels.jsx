import { useState } from "react";
import hotels from "../data/hotels";
import HotelCard from "../components/HotelCard";

function Hotels() {
  const [destination, setDestination] = useState("");
  const [showHotels, setShowHotels] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const handleSearch = () => {
    if (!destination) {
      setSearchMessage("Please enter a destination.");
      setShowHotels(false);
      return;
    }

    setSearchMessage(`Hotels available in ${destination}`);
    setShowHotels(true);
  };


const handleBook = async (hotel) => {
  const newBooking = {
    ...hotel,
    bookingType: "hotel",
    bookingReference: `TGO${Date.now()}`,
    bookingDate: new Date().toLocaleDateString("en-IN"),
    travelDate: new Date().toLocaleDateString("en-IN"),
    status: "Confirmed",
    price: Number(hotel.price),
  };

  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      }
    );

    const savedBooking = await response.json();

    if (!response.ok) {
      throw new Error(
        savedBooking.message || "Failed to save hotel booking."
      );
    }

    alert(
      `Hotel booked successfully!\n\nBooking Reference: ${savedBooking.bookingReference}`
    );
  } catch (error) {
    console.error("Hotel booking error:", error);
    alert(
      error.message || "Unable to book hotel. Please try again."
    );
  }
};


  return (
    <main className="hotels-page">
      <section className="hotels-header">
        <h1>Find Your Perfect Hotel</h1>

        <p>
          Search and book comfortable stays for your journey.
        </p>

        <div className="hotel-search-box">
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search Hotels
          </button>
        </div>
      </section>

      {searchMessage && (
        <p className="hotel-search-message">
          {searchMessage}
        </p>
      )}

      {showHotels && (
        <section className="hotel-results">
          <h2>Available Hotels</h2>

          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onBook={handleBook}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Hotels;