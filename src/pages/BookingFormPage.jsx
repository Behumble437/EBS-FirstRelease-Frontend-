import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createBooking, getBookingById, updateBooking } from "../api/bookingApi";
import { getEvents } from "../api/eventApi";

export default function BookingFormPage() {
  const [form, setForm] = useState({
    eventId: "",
    ticketsBooked: 1,
    pricePerTicket: 0,
  });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    async function loadData() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);

        const preselectedEventId = searchParams.get("eventId");
        if (preselectedEventId) {
          setForm((prev) => ({ ...prev, eventId: preselectedEventId }));
        }

        if (isEditMode) {
          const booking = await getBookingById(id);
          setForm({
            eventId: booking.event?._id || booking.event || "",
            ticketsBooked: booking.ticketsBooked,
            pricePerTicket: booking.totalPrice / booking.ticketsBooked || 0,
          });
        }
      } catch (err) {
        setError(err.message);
      }
    }
    loadData();
  }, [id, isEditMode, searchParams]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (isEditMode) {
        await updateBooking(id, { ticketsBooked: Number(form.ticketsBooked) });
      } else {
        await createBooking({
          eventId: form.eventId,
          ticketsBooked: Number(form.ticketsBooked),
          pricePerTicket: Number(form.pricePerTicket),
        });
      }
      navigate("/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-card">
      <h1>{isEditMode ? "Modify Booking" : "Book Tickets"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        {!isEditMode && (
          <label>
            Event
            <select name="eventId" value={form.eventId} onChange={handleChange} required>
              <option value="">-- Select an event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} — {new Date(event.date).toLocaleDateString()} — {event.location}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Number of Tickets
          <input
            type="number"
            name="ticketsBooked"
            value={form.ticketsBooked}
            onChange={handleChange}
            min="1"
            required
          />
        </label>

        {!isEditMode && (
          <label>
            Price Per Ticket ($)
            <input
              type="number"
              name="pricePerTicket"
              value={form.pricePerTicket}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </label>
        )}

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update Booking" : "Confirm Booking"}
          </button>
          <Link to="/bookings" className="primary-btn">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
