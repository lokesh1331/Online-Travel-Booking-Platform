
import { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("travelToken", data.token);
      localStorage.setItem("travelUser", JSON.stringify(data.user));

      setMessage("Login successful! Redirecting...");

      window.location.href = "/";
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Welcome Back</h1>
        <p>Log in to manage your TravelGo trips and bookings.</p>

        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {message && <p className="auth-message" role="status">{message}</p>}

        <p className="auth-switch">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </section>
    </main>
  );
}

export default Login;
