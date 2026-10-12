import { useEffect, useState } from "react";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const totalTravelers = users.filter(
  (user) => (user.role || "traveler") === "traveler"
).length;

const totalAdmins = users.filter(
  (user) => user.role === "admin"
).length;

const customersWithBookings = new Set(
  bookings
    .filter((booking) => booking.user)
    .map((booking) => String(booking.user))
).size;

const averageBookingsPerTraveler =
  totalTravelers > 0
    ? (
        bookings.filter((booking) => booking.user).length /
        totalTravelers
      ).toFixed(1)
    : "0";
    const [systemStatus, setSystemStatus] = useState("Checking...");
  const [packages, setPackages] = useState([]);
  const [editingPackageId, setEditingPackageId] = useState(null);
const [packageForm, setPackageForm] = useState({
  name: "",
  destination: "",
  description: "",
  price: "",
  duration: "",
});
const [packageMessage, setPackageMessage] = useState("");

const fetchPackages = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/packages");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load packages.");
    }

    setPackages(data);
  } catch (error) {
    setPackageMessage(error.message || "Unable to load packages.");
  }
};

const handleEditPackage = (item) => {
  setEditingPackageId(item._id);

  setPackageForm({
    name: item.name || "",
    destination: item.destination || "",
    description: item.description || "",
    price: String(item.price ?? ""),
    duration: item.duration || "",
  });

  setPackageMessage("Editing package: " + item.name);
};

const handlePackageChange = (event) => {
  const { name, value } = event.target;

  setPackageForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handlePackageSubmit = async (event) => {
  event.preventDefault();
  setPackageMessage("");

  try {
    const token = localStorage.getItem("travelToken");

    if (!token) {
      throw new Error("Please log in with your admin account.");
    }

  
const response = await fetch(
  editingPackageId
    ? `http://localhost:5000/api/packages/${editingPackageId}`
    : "http://localhost:5000/api/packages",
  {
    method: editingPackageId ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...packageForm,
      price: Number(packageForm.price),
    }),
  }
);


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create package.");
    }

     setPackageForm({
      name: "",
      destination: "",
      description: "",
      price: "",
      duration: "",
    });

    setEditingPackageId(null);

    setPackageMessage(
      editingPackageId
        ? "Travel package updated successfully!"
        : "Travel package added successfully!"
    );

    await fetchPackages();
  } catch (error) {
    setPackageMessage(error.message || "Unable to save package.");
  }
};

  const [bookingMessage, setBookingMessage] = useState(
    "Loading booking data..."
  );
  const [userMessage, setUserMessage] = useState(
    "Loading registered users..."
  );


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        setBookings(data);
        setBookingMessage("");
      } catch (error) {
        setBookingMessage(error.message || "Unable to load booking data.");
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("travelToken");

        if (!token) {
          throw new Error("Please log in with your admin account.");
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users.");
        }

        setUsers(data);
        setUserMessage("");
      } catch (error) {
        setUserMessage(error.message || "Unable to load users.");
      }
    };

    const checkSystemStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/");

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        setSystemStatus("Online");
      } catch {
        setSystemStatus("Offline");
      }
    };

    fetchBookings();
    fetchUsers();
    fetchPackages();
    checkSystemStatus();
  }, []);


  const totalRevenue = bookings
    .filter((booking) => booking.status === "Confirmed")
    .reduce(
      (total, booking) => total + Number(booking.price || 0),
      0
    );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>TravelGo Admin Dashboard</h1>
        <p>Monitor bookings, revenue, and registered travelers.</p>
        
<p>
  Backend Status:{" "}
  <strong
    style={{
      color: systemStatus === "Online" ? "green" : "red",
    }}
  >
    {systemStatus}
  </strong>
</p>

      </section>

      <section className="admin-summary">
        <article className="admin-card">
          <h2>Total Bookings</h2>
          <p>{bookings.length}</p>
        </article>

        <article className="admin-card">
          <h2>Confirmed Bookings</h2>
          <p>{confirmedBookings}</p>
        </article>

        <article className="admin-card">
          <h2>Cancelled Bookings</h2>
          <p>{cancelledBookings}</p>
        </article>

        <article className="admin-card">
          <h2>Confirmed Booking Revenue</h2>
          <p>₹{totalRevenue.toLocaleString("en-IN")}</p>
        </article>

        <article className="admin-card">
          <h2>Registered Users</h2>
          <p>{users.length}</p>
        </article>
      </section>

      <section className="admin-bookings">
        <h2>Booking Monitoring</h2>

        {bookingMessage && <p>{bookingMessage}</p>}

        {!bookingMessage && bookings.length === 0 && (
          <p>No bookings found.</p>
        )}

        {!bookingMessage && bookings.length > 0 && (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Traveler / Provider</th>
                  <th>Travel Date</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.bookingReference || booking._id}</td>
                    <td>{booking.bookingType || "N/A"}</td>
                    <td>
                      {booking.airline ||
                        booking.name ||
                        booking.provider ||
                        "N/A"}
                    </td>
                    <td>{booking.travelDate || "N/A"}</td>
                    <td>{booking.status || "N/A"}</td>
                    <td>
                      ₹{Number(booking.price || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-bookings">
        <h2>User Management</h2>
        <p>View the travelers registered on TravelGo.</p>

        {userMessage && <p>{userMessage}</p>}

        {!userMessage && users.length === 0 && (
          <p>No registered users found.</p>
        )}

        {!userMessage && users.length > 0 && (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "traveler"}</td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      <section className="admin-bookings">
        <h2>Travel Package Management</h2>
        <p>Create and view travel packages available on TravelGo.</p>

        {packageMessage && <p>{packageMessage}</p>}

        <form onSubmit={handlePackageSubmit}>
          <div>
            <label htmlFor="package-name">Package Name</label>
            <input
              id="package-name"
              name="name"
              value={packageForm.name}
              onChange={handlePackageChange}
              required
              placeholder="e.g. Goa Beach Holiday"
            />
          </div>

          <div>
            <label htmlFor="package-destination">Destination</label>
            <input
              id="package-destination"
              name="destination"
              value={packageForm.destination}
              onChange={handlePackageChange}
              required
              placeholder="e.g. Goa"
            />
          </div>

          <div>
            <label htmlFor="package-description">Description</label>
            <textarea
              id="package-description"
              name="description"
              value={packageForm.description}
              onChange={handlePackageChange}
              required
              placeholder="Describe the travel package"
            />
          </div>

          <div>
            <label htmlFor="package-price">Price (₹)</label>
            <input
              id="package-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={packageForm.price}
              onChange={handlePackageChange}
              required
              placeholder="e.g. 15000"
            />
          </div>

          <div>
            <label htmlFor="package-duration">Duration</label>
            <input
              id="package-duration"
              name="duration"
              value={packageForm.duration}
              onChange={handlePackageChange}
              required
              placeholder="e.g. 3 days, 2 nights"
            />
          </div>

          <button type="submit">Add Travel Package</button>
        </form>

        <h3>Available Packages</h3>

        {packages.length === 0 ? (
          <p>No travel packages added yet.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                
{packages.map((item) => (
  <tr key={item._id}>
    <td>{item.name}</td>
    <td>{item.destination}</td>
    <td>{item.duration}</td>
    <td>
      ₹{Number(item.price).toLocaleString("en-IN")}
    </td>
    
<td>
  <button
    type="button"
    onClick={() => handleEditPackage(item)}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${item.name}"?`
      );

      if (!confirmed) return;

      try {
        const token = localStorage.getItem("travelToken");

        const response = await fetch(
          `http://localhost:5000/api/packages/${item._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete package.");
        }

        setPackageMessage("Travel package deleted successfully!");
        await fetchPackages();
      } catch (error) {
        setPackageMessage(
          error.message || "Unable to delete travel package."
        );
      }
    }}
  >
    Delete
  </button>
</td>

  </tr>
))}

              </tbody>
            </table>
          </div>
        )}
      </section>
      
      <section className="admin-summary">
        <h2>Customer Analytics</h2>

        <article className="admin-card">
          <h3>Total Registered Users</h3>
          <p>{users.length}</p>
        </article>

        <article className="admin-card">
          <h3>Traveler Accounts</h3>
          <p>{totalTravelers}</p>
        </article>

        <article className="admin-card">
          <h3>Administrator Accounts</h3>
          <p>{totalAdmins}</p>
        </article>

        <article className="admin-card">
          <h3>Customers with Bookings</h3>
          <p>{customersWithBookings}</p>
        </article>

        <article className="admin-card">
          <h3>Average Bookings per Traveler</h3>
          <p>{averageBookingsPerTraveler}</p>
        </article>
      </section>

    </main>
  );
}

export default Admin;
