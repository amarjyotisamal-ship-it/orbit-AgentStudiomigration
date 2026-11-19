import React from "react";
import { History, Trash2 } from "lucide-react";

export function HistoryView({ saved, onOpenDemo, onDeleteDemo, demoError }) {
  return (
    <section className="history-list">
      <div className="section-title">
        <History/>
        <div><h3>Orbit local demo history</h3><p>These records are stored in Orbit, not the IRMA database.</p></div>
      </div>
      {demoError && <div className="error" role="alert">{demoError}</div>}
      {saved.length === 0 ? (
        <div className="empty"><History size={28}/><h3>No saved demo generations</h3><p>Use the local demo to add one.</p></div>
      ) : (
        saved.map(item => (
          <article className="history-item" key={item.id}>
            <div>
              <span className="eyebrow">{item.createdAt} · {item.provider}</span>
              <h3>{item.result?.title || item.topic}</h3>
              <p>{item.result?.summary}</p>
              <button className="history-open" onClick={() => onOpenDemo(item)}>Open demo</button>
            </div>
            <button aria-label="Delete saved demo" onClick={() => onDeleteDemo(item.id)}><Trash2 size={18}/></button>
          </article>
        ))
      )}
    </section>
  );
}
