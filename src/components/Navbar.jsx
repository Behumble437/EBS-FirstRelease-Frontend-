import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Event Booking System
        </Link>
        <p className="navbar-subtitle">
          Discover, choose, and reserve events with ease.
        </p>
      </div>

      <div className="navbar-center">
        <Link to="/">Home</Link>
      </div>

      <div className="navbar-right">
        {isLoggedIn && (
          <div className="user-badge">
            <span className="user-label">Signed in as</span>
            <span className="user-name">
              {user?.name || user?.email}
              {user?.role === "admin" ? " (Admin)" : ""}
            </span>
          </div>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
}