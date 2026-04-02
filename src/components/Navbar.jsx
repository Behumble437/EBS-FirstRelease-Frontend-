import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">EBS</h2>
        <p className="navbar-tagline">
          Discover, choose, and reserve events with ease.
        </p>
      </div>

      <div className="navbar-center">
        {isLoggedIn && (
          <>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/bookings">My Bookings</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <div className="user-badge">
              <span className="user-label">Signed in as</span>
              <span className="user-name">
                {user?.name || user?.email || "User"}
              </span>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}