import React from "react";
export function StatusPill({ ready }) {
  return (
    <span className={"status-pill " + (ready ? "ready" : "blocked")}>
      <i />
      {ready ? "External API ready" : "Adapter needed"}
    </span>
  );
}
