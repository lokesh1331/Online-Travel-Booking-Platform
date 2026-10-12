import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Cabs from "./pages/Cabs";
import Bookings from "./pages/Bookings";
import Destinations from "./pages/Destinations";
import FareComparison from "./pages/FareComparison";
import TripPlanner from "./pages/TripPlanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  const currentPath = window.location.pathname;
  if (currentPath === "/admin") {
  return (
    <>
      <Navbar />
      <Admin />
    </>
  );
}
  if (currentPath === "/profile") {
  return (
    <>
      <Navbar />
      <Profile />
    </>
  );
}
  if (currentPath === "/login") {
  return (
    <>
      <Navbar />
      <Login />
    </>
  );
}

if (currentPath === "/signup") {
  return (
    <>
      <Navbar />
      <Register />
    </>
  );
}

  return (
    <>
      <Navbar />

      {currentPath === "/bookings" ? (
        <Bookings />
      ) : currentPath === "/hotels" ? (
        <Hotels />
      ) : currentPath === "/cabs" ? (
        <Cabs />
      ) : currentPath === "/destinations" ? (
        <Destinations />
      ) : currentPath === "/fare-comparison" ? (
        <FareComparison />
      ) : currentPath === "/trip-planner" ? (
        <TripPlanner />
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;
