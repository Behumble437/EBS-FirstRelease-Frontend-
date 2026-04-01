import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import { isAdminRole } from "../utils/roles";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, isLoggedIn } = useAuth();

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteEvent(id);
      setSuccess("Event deleted successfully.");
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-card">
      <div className="page-header-row">
        <h1>Events</h1>
        {isAdminRole(user?.role) && (
          <Link to="/events/new" className="primary-btn">
            Add Event
          </Link>
        )}
      </div>

      {success && <p className="success-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="info-card">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Capacity:</strong> {event.capacity}</p>
              <p><strong>Description:</strong> {event.description}</p>

              <div className="card-actions">
                {isLoggedIn && (
                  <Link to={`/bookings/new?eventId=${event._id}`} className="secondary-btn">
                    Book Tickets
                  </Link>
                )}
                {isAdminRole(user?.role) && (
                  <>
                    <Link to={`/events/edit/${event._id}`} className="secondary-btn">
                      Edit
                    </Link>
                    <button className="text-btn" onClick={() => handleDelete(event._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
