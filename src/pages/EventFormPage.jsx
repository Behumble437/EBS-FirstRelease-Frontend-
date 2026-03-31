import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, getEventById, updateEvent } from "../api/eventApi";

export default function EventFormPage() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
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
        const data = await getEventById(id);
        const event = data;

        setForm({
          name: event.name || "",
          date: event.date ? event.date.split("T")[0] : "",
          location: event.location || "",
          description: event.description || "",
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
          Event Name
          <input
            type="text"
            name="name"
            value={form.name}
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
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
}