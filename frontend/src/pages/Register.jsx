
import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Registration successful! You can now log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Your TravelGo Account</h1>
        <p>Register to manage your trips and bookings.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="auth-message" role="status">{message}</p>}

        <p className="auth-switch">
          Already have an account? <a href="/login">Login</a>
        </p>
      </section>
    </main>
  );
}

export default Register;
