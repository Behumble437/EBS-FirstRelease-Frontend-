import { getApiBaseUrl } from "../config/apiBase";
import {
  asBookingList,
  mapBookingEventTitles,
  parseResponseBody,
} from "./normalizeResponse";

function getToken() {
  return localStorage.getItem("token");
}

export async function getBookings(mine = false) {
  const url = mine
    ? `${getApiBaseUrl()}/api/bookings?mine=true`
    : `${getApiBaseUrl()}/api/bookings`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return asBookingList(data).map(mapBookingEventTitles);
}

export async function getBookingById(id) {
  const res = await fetch(`${getApiBaseUrl()}/api/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch booking");
  }

  return mapBookingEventTitles(data);
}

export async function createBooking(formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data;
}

export async function updateBooking(id, formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data;
}

export async function deleteBooking(id) {
  const res = await fetch(`${getApiBaseUrl()}/api/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await parseResponseBody(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete booking");
  }

  return data;
}