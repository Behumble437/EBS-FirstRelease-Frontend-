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
        });
      } catch (err) {
        setError(err.message);
      }
    }
    loadEvent();
  }, [id, isEditMode]);

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
    <div className="page-card">
      <h1>{isEditMode ? "Edit Event" : "Add Event"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Event Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Capacity
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            min="1"
            required
          />
        </label>

        <label className="textarea-group">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="fixed-textarea"
          />
        </label>

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
