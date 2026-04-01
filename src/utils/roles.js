export function isAdminRole(role) {
  return String(role || "").toLowerCase() === "admin";
}
