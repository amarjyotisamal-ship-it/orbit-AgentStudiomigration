import React from "react";
import { Image as ImageIcon, Activity, Layers3, ArrowUpRight, Star } from "lucide-react";
import { StatusPill } from "./StatusPill.jsx";

export function AgentTile({ agent, isFavorite, onToggleFavorite, onSelect }) {
  return (
    <button className="agent-tile" onClick={() => onSelect(agent)}>
      <span className="tile-top">
        <span className="tile-icon">{agent.mode === 'generate' ? <ImageIcon/> : agent.externalApi ? <Activity/> : <Layers3/>}</span>
        <span className="tile-actions">
          <button
            type="button"
            className={`fav-star-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => onToggleFavorite(e, agent.id)}
            title={isFavorite ? 'Remove bookmark' : 'Bookmark agent'}
          >
            <Star size={14} fill={isFavorite ? '#fbbf24' : 'none'} color={isFavorite ? '#fbbf24' : '#64748b'} />
          </button>
          <StatusPill ready={agent.externalApi}/>
        </span>
      </span>
      <span className="tile-category">{agent.category || 'Agent Studio'}</span>
      <strong>{agent.name}</strong>
      <span className="tile-description">{agent.description || 'Agent workflow and capability.'}</span>
      <span className="tile-foot"><small>{agent.externalApi ? 'Open external agent' : 'View integration status'}</small><ArrowUpRight size={16}/></span>
    </button>
  );
}
