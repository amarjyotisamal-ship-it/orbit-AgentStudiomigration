import React from "react";
import { AgentTile } from "./AgentTile.jsx";

export function AgentGrid({ agents, favorites, onToggleFavorite, onSelectAgent }) {
  if (agents.length === 0) {
    return <div className="catalog-empty">No agents match your search or filters.</div>;
  }
  return (
    <section className="agent-grid" aria-label="AI Agent Studio catalog">
      {agents.map(agent => (
        <AgentTile
          key={agent.id}
          agent={agent}
          isFavorite={favorites.has(agent.id) || favorites.has(agent.capabilityId)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelectAgent}
        />
      ))}
    </section>
  );
}
