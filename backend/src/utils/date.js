export function formatIso(date = new Date()) {
  return (date instanceof Date ? date : new Date(date)).toISOString();
}
export function formatDisplayDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
}
