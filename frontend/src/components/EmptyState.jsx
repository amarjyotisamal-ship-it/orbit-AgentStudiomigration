import React from "react";
import { Search } from "lucide-react";

export function EmptyState({ title = "No matching items", message = "Try adjusting your search filters.", onReset }) {
  return (
    <div className="catalog-empty-state">
      <Search size={32} color="#64748b"/>
      <h3>{title}</h3>
      <p>{message}</p>
      {onReset && <button className="action-btn" onClick={onReset}>Clear filters</button>}
    </div>
  );
}
