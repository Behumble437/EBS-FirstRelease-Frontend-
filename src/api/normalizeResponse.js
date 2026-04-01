export function asEventList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.events)) return data.events;
  return [];
}

export function asBookingList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.bookings)) return data.bookings;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

export function withEventTitleField(event) {
  if (!event || typeof event !== "object") return event;
  return { ...event, title: event.title ?? event.name ?? "" };
}

export function mapBookingEventTitles(booking) {
  if (!booking || typeof booking !== "object") return booking;
  const ev = booking.event;
  if (ev && typeof ev === "object") {
    return { ...booking, event: withEventTitleField(ev) };
  }
  return booking;
}

export async function parseResponseBody(res) {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
