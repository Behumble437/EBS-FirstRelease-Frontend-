import { getApiBaseUrl } from "../config/apiBase";

export async function loginUser(formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  const token = data.token ?? data.accessToken;
  if (!token) {
    throw new Error("Login response missing token. Check backend auth payload.");
  }
  if (!data.user) {
    throw new Error("Login response missing user. Check backend auth payload.");
  }

  return { user: data.user, token };
}

export async function registerUser(formData) {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
}
