const API_BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

export async function getEvents() {
  const res = await fetch(`${API_BASE_URL}/api/events`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return data;
}

export async function getEventById(id) {
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch event");
  }

  return data;
}

export async function createEvent(formData) {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create event");
  }

  return data;
}

export async function updateEvent(id, formData) {
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update event");
  }

  return data;
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete event");
  }

  return data;
}