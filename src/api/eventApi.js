import { getApiBaseUrl } from "../config/apiBase";
import {
  asEventList,
  parseResponseBody,
  withEventTitleField,
} from "./normalizeResponse";

function getToken() {
  return localStorage.getItem("token");
}

function toEventWriteBody(formData) {
  return {
    name: formData.title ?? formData.name ?? "",
    date: formData.date,
    location: formData.location,
    description: formData.description,
    capacity:
      formData.capacity === "" || formData.capacity === undefined
        ? 0
        : Number(formData.capacity),
    pricePerTicket:
      formData.pricePerTicket === "" || formData.pricePerTicket === undefined
        ? 0
        : Number(formData.pricePerTicket),
  };
}
export async function getEvents() {
  const res = await fetch(`${getApiBaseUrl()}/api/events`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return asEventList(data).map(withEventTitleField);
}

export async function getEventById(id) {
  const res = await fetch(`${getApiBaseUrl()}/api/events/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch event");
  }

  return withEventTitleField(data);
}

export async function createEvent(formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(toEventWriteBody(formData)),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create event");
  }

  return data;
}

export async function updateEvent(id, formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(toEventWriteBody(formData)),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update event");
  }

  return data;
}

export async function deleteEvent(id) {
  const res = await fetch(`${getApiBaseUrl()}/api/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await parseResponseBody(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete event");
  }

  return data;
}
