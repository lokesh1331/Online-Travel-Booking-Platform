
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading profile...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("travelToken");

    if (!token) {
      setMessage("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        setUser(data.user);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <main className="auth-page"><p>Loading profile...</p></main>;
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>My Profile</h1>
          <p>{message}</p>
          <a href="/login">Go to Login</a>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>My Profile</h1>
        <p>View your TravelGo account details.</p>

        <div className="profile-details">
          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>
            <strong>Account Created:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-IN")
              : "Not available"}
          </p>
        </div>

        <a href="/bookings">View My Trips</a>
      </section>
    </main>
  );
}

export default Profile;
