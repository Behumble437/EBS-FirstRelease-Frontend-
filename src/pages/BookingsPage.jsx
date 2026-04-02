import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, deleteBooking } from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";
import { isAdminRole } from "../utils/roles";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  function getUserId(currentUser) {
    return currentUser?._id || currentUser?.id || currentUser?.userId || "";
  }

  async function loadBookings() {
    try {
      setError("");
      const data = await getBookings(!isAdminRole(user?.role));

      // admin can see all bookings
      if (isAdminRole(user?.role)) {
        setBookings(data);
        return;
      }

      // normal user only sees their own bookings
      const currentUserId = getUserId(user);

      const myBookings = data.filter((booking) => {
        const bookingUserId =
          booking?.user?._id ||
          booking?.user?.id ||
          booking?.user ||
          booking?.userId ||
          "";

        return String(bookingUserId) === String(currentUserId);
      });

      setBookings(myBookings);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [user]);

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
    <div className="page-container">
      <div className="section-header">
        <h1 className="section-title">
          {isAdminRole(user?.role) ? "All Bookings" : "My Bookings"}
        </h1>

        <Link to="/bookings/new" className="primary-btn">
          New Booking
        </Link>
      </div>

      {success && <p className="success-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found. Browse events to book tickets.</p>
      ) : (
        <div className="card-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <h3>{booking.event?.title || "Event"}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {booking.event?.date
                  ? new Date(booking.event.date).toLocaleDateString()
                  : "—"}
              </p>
              <p>
                <strong>Location:</strong> {booking.event?.location || "—"}
              </p>
              <p>
                <strong>Tickets:</strong> {booking.ticketsBooked}
              </p>
              <p>
                <strong>Total Price:</strong> $
                {Number(booking.totalPrice || 0).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Payment:</strong> {booking.paymentStatus}
              </p>

              <div className="card-actions">
                <Link
                  to={`/bookings/edit/${booking._id}`}
                  className="primary-btn"
                >
                  Modify
                </Link>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="danger-btn"
                >
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