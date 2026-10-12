import { useEffect, useState } from "react";
import flights from "../data/flights";
import FlightCard from "../components/FlightCard";
import BookingConfirmation from "../components/BookingConfirmation";

function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [showFlights, setShowFlights] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
  const savedBookings = localStorage.getItem("travelBookings");

  if (savedBookings) {
    setBookings(JSON.parse(savedBookings));
  }
}, []);

const handleBook = async (flight) => {
  const newBooking = {
    ...flight,
    bookingType: "flight",
    bookingReference: `TGO${Date.now()}`,
    bookingDate: new Date().toLocaleDateString("en-IN"),
    travelDate: departure,
    status: "Confirmed",
    price: Number(flight.price),
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
        savedBooking.message || "Failed to save booking."
      );
    }

    setBookings((currentBookings) => [
      ...currentBookings,
      savedBooking,
    ]);

    setSelectedFlight(savedBooking);
  } catch (error) {
    console.error("Booking error:", error);
    alert(error.message || "Unable to book flight. Please try again.");
  }
};


  const handleSearch = () => {
    if (!from || !to || !departure) {
      setSearchMessage("Please enter your travel details.");
      setShowFlights(false);
      return;
    }

    setSearchMessage(
      `Available flights from ${from} to ${to} for ${departure}`
    );
    setShowFlights(true);
  };

  return (
    <main className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">

          <p className="hero-tagline">
            YOUR JOURNEY STARTS HERE
          </p>

          <h1>
            Explore the World,
            <br />
            <span>Travel Your Way.</span>
          </h1>

          <p className="hero-description">
            Search flights, hotels, cabs and complete your trip planning
            from one simple travel platform.
          </p>

          {/* Search Box */}
          <div className="search-box">

            {/* From */}
            <div className="search-item">
              <span>📍</span>

              <div>
                <small>From</small>

                <input
                  type="text"
                  placeholder="Enter city"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
            </div>

            {/* To */}
            <div className="search-item">
              <span>📍</span>

              <div>
                <small>To</small>

                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>

            {/* Departure */}
            <div className="search-item">
              <span>📅</span>

              <div>
                <small>Departure</small>

                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

          {/* Search Result Message */}
          {searchMessage && (
            <p className="search-message">
              {searchMessage}
            </p>
          )}
          {showFlights && (
  <section className="flight-results">

    <div className="flight-results-heading">
      <div>
        <p>AVAILABLE FLIGHTS</p>
        <h2>
          {from} → {to}
        </h2>
      </div>

      <span>
        {flights.length} flights found
      </span>
    </div>

    <div className="flight-list">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
           onBook={handleBook}
        />
      ))}
    </div>

  </section>
)}

        </div>
      </section>

      {/* Services Section */}
      <section className="services">

        <div className="section-heading">
          <p>PLAN YOUR JOURNEY</p>
          <h2>Everything You Need to Travel</h2>
        </div>

        <div className="service-grid">

          {/* Flight Card */}
          <div className="service-card">
            <div className="service-icon">✈️</div>

            <h3>Flights</h3>

            <p>
              Search and compare flights to find the best option
              for your journey.
            </p>
          </div>

          {/* Hotel Card */}
          <div className="service-card">
            <div className="service-icon">🏨</div>

            <h3>Hotels</h3>

            <p>
              Discover comfortable stays and compare hotel prices
              in one place.
            </p>
          </div>

          {/* Cab Card */}
          <div className="service-card">
            <div className="service-icon">🚕</div>

            <h3>Cabs</h3>

            <p>
              Book convenient cab services for airport transfers
              and local travel.
            </p>
          </div>

          {/* Trip Planner Card */}
          <div className="service-card">
            <div className="service-icon">🗺️</div>

            <h3>Trip Planner</h3>

            <p>
              Create your own itinerary and organize every part
              of your journey.
            </p>
          </div>

        </div>
      </section>
      {selectedFlight && (
  <BookingConfirmation
    flight={selectedFlight}
    onClose={() => setSelectedFlight(null)}
  />
)}

    </main>
  );
}

export default Home;