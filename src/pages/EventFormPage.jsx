import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createEvent, getEventById, updateEvent } from "../api/eventApi";

export default function EventFormPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
    pricePerTicket: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    async function loadEvent() {
      if (!isEditMode) return;

      try {
        const event = await getEventById(id);

        setForm({
          title: event.title || "",
          date: event.date ? event.date.split("T")[0] : "",
          location: event.location || "",
          description: event.description || "",
          capacity: event.capacity || "",
          pricePerTicket: event.pricePerTicket || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }

    loadEvent();
  }, [id, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await updateEvent(id, form);
      } else {
        await createEvent(form);
      }

      navigate("/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card form-card">
      <h1 className="section-title">
        {isEditMode ? "Edit Event" : "Add Event"}
      </h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price Per Ticket ($)</label>
          <input
            name="pricePerTicket"
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerTicket}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
          </button>

          <Link to="/events" className="primary-btn">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}