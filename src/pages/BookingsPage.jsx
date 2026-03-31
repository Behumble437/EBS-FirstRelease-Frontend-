import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, deleteBooking } from "../api/bookingApi";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadBookings() {
    try {
      const data = await getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteBooking(id);
      setSuccess("Booking cancelled successfully.");
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-card">
      <div className="page-header-row">
        <h1>My Bookings</h1>
        <Link to="/bookings/new" className="primary-btn">
          New Booking
        </Link>
      </div>

      {success && <p className="success-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found. <Link to="/events">Browse events</Link> to book tickets.</p>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="info-card">
              <h3>{booking.event?.title || "Event"}</h3>
              <p><strong>Date:</strong> {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "—"}</p>
              <p><strong>Location:</strong> {booking.event?.location || "—"}</p>
              <p><strong>Tickets:</strong> {booking.ticketsBooked}</p>
              <p><strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                <span className={`status-badge status-${booking.paymentStatus}`}>
                  {booking.paymentStatus}
                </span>
              </p>

              <div className="card-actions">
                <Link to={`/bookings/edit/${booking._id}`} className="secondary-btn">
                  Modify
                </Link>
                <button className="text-btn" onClick={() => handleDelete(booking._id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
