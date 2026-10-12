
function Navbar() {
  const user = JSON.parse(localStorage.getItem("travelUser") || "null");
  const token = localStorage.getItem("travelToken");

  const handleLogout = () => {
    localStorage.removeItem("travelToken");
    localStorage.removeItem("travelUser");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span>✈️</span>
          TravelGo
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/">Flights</a>
          <a href="/hotels">Hotels</a>
          <a href="/cabs">Cabs</a>
          <a href="/destinations">Destinations</a>
          <a href="/bookings">Trips</a>
          <a href="/profile">Profile</a>
          <a href="/fare-comparison">Fare Comparison</a>
          <a href="/trip-planner">Trip Planner</a>
        </div>

        <div className="nav-actions">
          {token && user ? (
            <>
              <span className="user-greeting">
                Hi, {user.name}
              </span>
              <button className="login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="login-btn">
                Login
              </a>
              <a href="/signup" className="signup-btn">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
