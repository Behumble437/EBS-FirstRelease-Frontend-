const raw = import.meta.env.VITE_API_URL;

export const API_BASE_URL =
  typeof raw === "string" && raw.trim() !== ""
    ? raw.trim().replace(/\/$/, "")
    : "";

export function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL is not set. Copy .env.example to .env.local, set VITE_API_URL to your backend base URL, then restart the dev server."
    );
  }
  return API_BASE_URL;
}
