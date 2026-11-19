import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function DemoResult({ item }) {
  if (!item) return null;
  const result = item.result || {};
  return (
    <section className="demo-result">
      <div className="section-title">
        <Sparkles size={18} />
        <div>
          <h3>{result.title || item.topic}</h3>
          <p>{item.provider} · {item.createdAt}</p>
        </div>
      </div>
      {result.summary && <p className="demo-summary">{result.summary}</p>}
      {Array.isArray(result.directions) && (
        <div className="direction-cards">
          {result.directions.map((d, i) => (
            <article key={i} className="direction-card">
              <span className="badge">Option {i + 1}</span>
              <h4>{d.angle || d.title}</h4>
              <p>{d.details || d.summary}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
