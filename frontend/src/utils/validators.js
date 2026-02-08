export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}
export function required(v, label) {
  if (!v || String(v).trim() === "") return `${label} is required`;
  return null;
}
export function passwordError(pw) {
  if (!pw || pw.length < 6) return "Password must be at least 6 characters";
  return null;
}
