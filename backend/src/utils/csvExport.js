export function formatGenerationsCsv(generations) {
  const headers = ["ID", "Topic", "Audience", "Tone", "Provider", "Created At"];
  const rows = (generations || []).map(g => [
    g.id,
    `"${(g.topic || "").replace(/"/g, '""')}"`,
    `"${(g.audience || "").replace(/"/g, '""')}"`,
    `"${(g.tone || "").replace(/"/g, '""')}"`,
    g.provider || "mock",
    g.created_at
  ].join(","));
  return [headers.join(","), ...rows].join("\n");
}
