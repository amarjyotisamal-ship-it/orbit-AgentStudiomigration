import React from "react";
import { Activity } from "lucide-react";

export function PageHeader({ title, eyebrow = "ORBIT / EXTERNAL AI PLATFORM", latencyMs = null }) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      <div className="header-status-area">
        {latencyMs != null && (
          <span className="latency-badge" title="Live Agent Studio catalog round-trip latency">
            <Activity size={12} /> {latencyMs}ms
          </span>
        )}
        <span className="status"><i/> Orbit database connected</span>
      </div>
    </header>
  );
}
