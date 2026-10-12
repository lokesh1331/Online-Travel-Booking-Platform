import { useEffect, useState } from "react";
import destinations from "../data/destinations";

function TripPlanner() {
  const [itineraries, setItineraries] = useState(() =>
    JSON.parse(localStorage.getItem("travelItineraries")) || []
  );

  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTripId, setSelectedTripId] = useState(null);

  const [dayNumber, setDayNumber] = useState("1");
  const [activity, setActivity] = useState("");
  const [activityTime, setActivityTime] = useState("");

  const [checklistItem, setChecklistItem] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "travelItineraries",
      JSON.stringify(itineraries)
    );
  }, [itineraries]);

  const selectedTrip = itineraries.find(
    (trip) => trip.id === selectedTripId
  );

  const handleCreateTrip = (event) => {
    event.preventDefault();

    if (!tripName.trim() || !destination || !startDate || !endDate) {
      alert("Please fill in the trip name, destination, and dates.");
      return;
    }

    if (endDate < startDate) {
      alert("The end date cannot be before the start date.");
      return;
    }

    const newTrip = {
      id: Date.now(),
      tripName: tripName.trim(),
      destination,
      startDate,
      endDate,
      budget: Number(budget) || 0,
      notes: "",
      activities: [],
      checklist: [],
    };

    setItineraries((current) => [...current, newTrip]);
    setSelectedTripId(newTrip.id);

    setTripName("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setNotes("");
  };

  const updateSelectedTrip = (updates) => {
    setItineraries((current) =>
      current.map((trip) =>
        trip.id === selectedTripId
          ? { ...trip, ...updates }
          : trip
      )
    );
  };

  const handleAddActivity = (event) => {
    event.preventDefault();

    if (!activity.trim()) {
      alert("Please enter an activity.");
      return;
    }

    const newActivity = {
      id: Date.now(),
      day: Number(dayNumber),
      name: activity.trim(),
      time: activityTime,
    };

    updateSelectedTrip({
      activities: [...selectedTrip.activities, newActivity],
    });

    setActivity("");
    setActivityTime("");
  };

  const handleRemoveActivity = (activityId) => {
    updateSelectedTrip({
      activities: selectedTrip.activities.filter(
        (item) => item.id !== activityId
      ),
    });
  };

  const handleAddChecklistItem = (event) => {
    event.preventDefault();

    if (!checklistItem.trim()) return;

    updateSelectedTrip({
      checklist: [
        ...selectedTrip.checklist,
        {
          id: Date.now(),
          text: checklistItem.trim(),
          completed: false,
        },
      ],
    });

    setChecklistItem("");
  };

  const handleToggleChecklist = (itemId) => {
    updateSelectedTrip({
      checklist: selectedTrip.checklist.map((item) =>
        item.id === itemId
          ? { ...item, completed: !item.completed }
          : item
      ),
    });
  };

  const handleRemoveChecklistItem = (itemId) => {
    updateSelectedTrip({
      checklist: selectedTrip.checklist.filter(
        (item) => item.id !== itemId
      ),
    });
  };

  const handleSaveNotes = (value) => {
    setNotes(value);
    updateSelectedTrip({ notes: value });
  };

  const handleRemoveTrip = (tripId) => {
    const remainingTrips = itineraries.filter(
      (trip) => trip.id !== tripId
    );

    setItineraries(remainingTrips);

    if (selectedTripId === tripId) {
      setSelectedTripId(null);
    }
  };

  const calculateDays = (start, end) => {
    const startTime = new Date(`${start}T00:00:00`);
    const endTime = new Date(`${end}T00:00:00`);

    return Math.floor(
      (endTime - startTime) / (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const getFavoriteDestinations = () =>
    JSON.parse(localStorage.getItem("travelFavorites")) || [];

  const [favoriteDestinations] = useState(getFavoriteDestinations);

  return (
    <main className="trip-planner-page">
      <section className="trip-planner-header">
        <h1>Trip Planner</h1>
        <p>
          Create itineraries, organize daily activities, manage
          your budget, and prepare for your journey.
        </p>
      </section>

      {/* Favorite destinations */}
      <section className="planner-section">
        <h2>Favorite Destinations</h2>

        {favoriteDestinations.length > 0 ? (
          <div className="planner-favorites">
            {favoriteDestinations.map((place) => (
              <span className="planner-favorite" key={place.id}>
                ★ {place.name}
              </span>
            ))}
          </div>
        ) : (
          <p>
            No favorite destinations yet. Add favorites from
            the Destinations page.
          </p>
        )}
      </section>

      {/* Create custom itinerary */}
      <section className="planner-section">
        <h2>Create a Custom Itinerary</h2>

        <form className="planner-form" onSubmit={handleCreateTrip}>
          <label>
            Trip Name
            <input
              value={tripName}
              onChange={(event) => setTripName(event.target.value)}
              placeholder="e.g. Family Vacation"
              required
            />
          </label>

          <label>
            Destination
            <select
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              required
            >
              <option value="">Select destination</option>
              {destinations.map((place) => (
                <option key={place.id} value={place.name}>
                  {place.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </label>

          <label>
            Budget (₹)
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="e.g. 15000"
            />
          </label>

          <button type="submit">Create Itinerary</button>
        </form>
      </section>

      {/* Saved itineraries */}
      <section className="planner-section">
        <h2>My Itineraries</h2>

        {itineraries.length === 0 ? (
          <p>No itineraries created yet.</p>
        ) : (
          <div className="planner-trip-list">
            {itineraries.map((trip) => (
              <div className="planner-trip-card" key={trip.id}>
                <div>
                  <h3>{trip.tripName}</h3>
                  <p>{trip.destination}</p>
                  <p>{trip.startDate} to {trip.endDate}</p>
                  <p>
                    {calculateDays(trip.startDate, trip.endDate)} day(s)
                  </p>
                </div>

                <div className="planner-trip-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setNotes(trip.notes || "");
                    }}
                  >
                    Plan Trip
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveTrip(trip.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Selected itinerary planning tools */}
      {selectedTrip && (
        <section className="planner-section">
          <h2>{selectedTrip.tripName}: Day-wise Planner</h2>

          <p>
            {selectedTrip.destination} · {selectedTrip.startDate} to{" "}
            {selectedTrip.endDate}
          </p>

          {/* Day-wise activities */}
          <h3>Activity Scheduling</h3>

          <form className="planner-form" onSubmit={handleAddActivity}>
            <label>
              Day
              <select
                value={dayNumber}
                onChange={(event) => setDayNumber(event.target.value)}
              >
                {Array.from(
                  {
                    length: calculateDays(
                      selectedTrip.startDate,
                      selectedTrip.endDate
                    ),
                  },
                  (_, index) => index + 1
                ).map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Activity
              <input
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
                placeholder="e.g. Visit a museum"
                required
              />
            </label>

            <label>
              Time
              <input
                type="time"
                value={activityTime}
                onChange={(event) => setActivityTime(event.target.value)}
              />
            </label>

            <button type="submit">Add Activity</button>
          </form>

          {Array.from(
            {
              length: calculateDays(
                selectedTrip.startDate,
                selectedTrip.endDate
              ),
            },
            (_, index) => index + 1
          ).map((day) => (
            <div className="planner-day" key={day}>
              <h4>Day {day}</h4>

              {selectedTrip.activities
                .filter((item) => item.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((item) => (
                  <div className="planner-list-item" key={item.id}>
                    <span>
                      {item.time || "Time not set"} — {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

              {!selectedTrip.activities.some((item) => item.day === day) && (
                <p>No activities planned.</p>
              )}
            </div>
          ))}

          {/* Budget planning */}
          <h3>Budget Planning</h3>

          <label>
            Total Trip Budget (₹)
            <input
              type="number"
              min="0"
              value={selectedTrip.budget}
              onChange={(event) =>
                updateSelectedTrip({
                  budget: Number(event.target.value) || 0,
                })
              }
            />
          </label>

          <p>
            Planned budget: ₹
            {Number(selectedTrip.budget).toLocaleString("en-IN")}
          </p>

          {/* Travel checklist */}
          <h3>Travel Checklist</h3>

          <form className="planner-form" onSubmit={handleAddChecklistItem}>
            <label>
              Checklist Item
              <input
                value={checklistItem}
                onChange={(event) => setChecklistItem(event.target.value)}
                placeholder="e.g. Pack ID proof"
                required
              />
            </label>

            <button type="submit">Add Item</button>
          </form>

          {selectedTrip.checklist.map((item) => (
            <div className="planner-list-item" key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleChecklist(item.id)}
                />
                <span
                  className={item.completed ? "planner-completed" : ""}
                >
                  {item.text}
                </span>
              </label>

              <button
                type="button"
                onClick={() => handleRemoveChecklistItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Travel notes */}
          <h3>Travel Notes</h3>

          <label>
            Notes for this trip
            <textarea
              rows="5"
              value={selectedTrip.notes ?? ""}
              onChange={(event) => handleSaveNotes(event.target.value)}
              placeholder="Write useful details for your journey..."
            />
          </label>
        </section>
      )}
    </main>
  );
}

export default TripPlanner;
