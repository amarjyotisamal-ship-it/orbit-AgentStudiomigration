import React from "react";

export function CatalogStats({ totalCount, availableCount }) {
  const pending = totalCount != null && availableCount != null ? Math.max(0, totalCount - availableCount) : '—';
  return (
    <div className="catalog-stats">
      <div><span>Discovered agents</span><strong>{totalCount != null ? totalCount : '—'}</strong><small>From live Studio catalog</small></div>
      <div><span>External API ready</span><strong>{availableCount != null ? availableCount : '—'}</strong><small>Real API operations</small></div>
      <div><span>Awaiting adapter</span><strong>{pending}</strong><small>Not silently omitted</small></div>
    </div>
  );
}
