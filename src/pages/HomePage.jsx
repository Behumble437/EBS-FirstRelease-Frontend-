import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="card hero">
      <p className="hero-tag">Ticket-Based Event Reservation Platform</p>

      <p className="hero-text">
        Find an event that fits your vibe and reserve your spot in seconds.
      </p>

      <Link to="/events" className="primary-btn">
        View Events
      </Link>

    </div>
  );
}