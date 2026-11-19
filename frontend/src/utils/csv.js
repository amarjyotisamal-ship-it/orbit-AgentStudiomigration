export function arrayToCsv(items, fields) {
  if (!Array.isArray(items) || items.length === 0) return "";
  const header = fields.join(",");
  const rows = items.map(item =>
    fields.map(field => {
      const val = String(item[field] ?? "").replace(/"/g, '""');
      return `"${val}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}
