import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createBooking, getBookingById, updateBooking } from "../api/bookingApi";
import { getEvents } from "../api/eventApi";

export default function BookingFormPage() {
  const [form, setForm] = useState({
    eventId: "",
    ticketsBooked: 1,
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
        if (preselectedEventId && !isEditMode) {
          setForm((prev) => ({
            ...prev,
            eventId: preselectedEventId,
          }));
        }

        if (isEditMode) {
          const booking = await getBookingById(id);
          setForm({
            eventId: booking.event?._id || booking.event || "",
            ticketsBooked: booking.ticketsBooked,
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const selectedEvent = useMemo(() => {
    return events.find((event) => String(event._id) === String(form.eventId));
  }, [events, form.eventId]);

  const pricePerTicket = Number(selectedEvent?.pricePerTicket || 0);
  const totalPrice = Number(form.ticketsBooked || 0) * pricePerTicket;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await updateBooking(id, {
          ticketsBooked: Number(form.ticketsBooked),
        });
      } else {
        await createBooking({
          eventId: form.eventId,
          ticketsBooked: Number(form.ticketsBooked),
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
    <div className="card form-card">
      <h1 className="section-title">
        {isEditMode ? "Modify Booking" : "Book Tickets"}
      </h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {!isEditMode && (
          <div className="form-group">
            <label>Event</label>
            <select
              name="eventId"
              value={form.eventId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select an event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} — {new Date(event.date).toLocaleDateString()} —{" "}
                  {event.location}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isEditMode && selectedEvent && (
          <>
            <p>
              <strong>Price Per Ticket:</strong> ${pricePerTicket.toFixed(2)}
            </p>
            <p>
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </p>
          </>
        )}

        <div className="form-group">
          <label>Number of Tickets</label>
          <input
            name="ticketsBooked"
            type="number"
            min="1"
            value={form.ticketsBooked}
            onChange={handleChange}
            required
          />
        </div>

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