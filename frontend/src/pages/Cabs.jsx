import { useState } from "react";
import cabs from "../data/cabs";
import CabCard from "../components/CabCard";

function Cabs() {
  const [location, setLocation] = useState("");
  const [showCabs, setShowCabs] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const filteredCabs = cabs.filter(
  (cab) =>
    cab.location.toLowerCase() === location.trim().toLowerCase()
);

  const handleSearch = () => {
  if (!location.trim()) {
    setSearchMessage("Please enter a location.");
    setShowCabs(false);
    return;
  }

  setSearchMessage(`Cabs available in ${location.trim()}`);
  setShowCabs(true);
};


const handleBook = async (cab) => {
  const newBooking = {
    ...cab,
    bookingType: "cab",
    bookingReference: `TGO${Date.now()}`,
    bookingDate: new Date().toLocaleDateString("en-IN"),
    travelDate: new Date().toLocaleDateString("en-IN"),
    status: "Confirmed",
    price: Number(cab.price),
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
        savedBooking.message || "Failed to save cab booking."
      );
    }

    alert(
      `Cab booked successfully!\n\nBooking Reference: ${savedBooking.bookingReference}`
    );
  } catch (error) {
    console.error("Cab booking error:", error);
    alert(
      error.message || "Unable to book cab. Please try again."
    );
  }
};


  return (
    <main className="cabs-page">
      <section className="cabs-header">
        <h1>Book Your Cab</h1>

        <p>
          Find comfortable and reliable rides for your journey.
        </p>

        <div className="cab-search-box">
          <input
            type="text"
            placeholder="Enter pickup location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search Cabs
          </button>
        </div>
      </section>

      {searchMessage && (
        <p className="cab-search-message">
          {searchMessage}
        </p>
      )}

      
{showCabs && (
  <section className="cab-results">
    <h2>Available Cabs</h2>

    {filteredCabs.length > 0 ? (
      <div className="cab-grid">
        {filteredCabs.map((cab) => (
          <CabCard
            key={cab.id}
            cab={cab}
            onBook={handleBook}
          />
        ))}
      </div>
    ) : (
      <p className="cab-search-message">
        No cabs available in {location.trim()}. Try Hyderabad,
        Vijayawada, or Visakhapatnam.
      </p>
    )}
  </section>
)}

    </main>
  );
}

export default Cabs;