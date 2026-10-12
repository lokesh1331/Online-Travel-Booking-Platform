import { useState } from "react";
import flights from "../data/flights";

function FareComparison() {
  const [sortBy, setSortBy] = useState("price");

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    }

    if (sortBy === "duration") {
      const getMinutes = (duration) => {
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        return match
          ? Number(match[1]) * 60 + Number(match[2])
          : 0;
      };

      return getMinutes(a.duration) - getMinutes(b.duration);
    }

    return a.airline.localeCompare(b.airline);
  });

  return (
    <main className="fare-comparison-page">
      <section className="fare-comparison-header">
        <h1>Fare Comparison Dashboard</h1>
        <p>
          Compare available flights, fares, departure times,
          and journey durations to find the right option.
        </p>

        <label htmlFor="sort-flights">Sort flights by: </label>
        <select
          id="sort-flights"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="price">Lowest price</option>
          <option value="duration">Shortest duration</option>
          <option value="airline">Airline name</option>
        </select>
      </section>

      <section className="fare-comparison-results">
        <h2>
          {flights[0]?.from} → {flights[0]?.to}
        </h2>

        <div className="fare-table-wrapper">
          <table className="fare-table">
            <thead>
              <tr>
                <th>Airline</th>
                <th>Flight</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Duration</th>
                <th>Stops</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {sortedFlights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.airline}</td>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.departure}</td>
                  <td>{flight.arrival}</td>
                  <td>{flight.duration}</td>
                  <td>{flight.stops}</td>
                  <td>₹{flight.price.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default FareComparison;
