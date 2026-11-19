export function titleCase(str) {
  if (!str) return "";
  return String(str).replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
export function truncate(str, maxLen = 80) {
  if (!str || str.length <= maxLen) return str || "";
  return str.slice(0, maxLen).trim() + "...";
}
