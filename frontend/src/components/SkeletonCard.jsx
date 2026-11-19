import React from "react";

export function SkeletonCard() {
  return (
    <div className="agent-tile skeleton">
      <div className="skeleton-line title" />
      <div className="skeleton-line text" />
      <div className="skeleton-line text short" />
    </div>
  );
}
