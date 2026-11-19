import React, { useState } from "react";
import { CheckCircle2, Image as ImageIcon, Copy, Download, Check, Clock } from "lucide-react";

export function Results({ value }) {
  if (!value) return null;
  const [copied, setCopied] = useState(false);
  const content = value.output || value;
  const candidates = Array.isArray(value.candidates) ? value.candidates : [];
  const summary = content.summary || content.executive_summary || content.direct_answer || content.executive_assessment;

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-output-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="studio-response" aria-live="polite">
      <div className="response-heading-wrap">
        <div className="response-heading"><CheckCircle2 size={21}/><div>
          <span className="eyebrow">AGENT RESPONSE</span><h3>{String(value.status || content.status || 'Request completed').replaceAll('_', ' ')}</h3>
        </div></div>
        <div className="response-actions">
          {value?._meta?.latencyMs != null && (
            <span className="response-timing" title="Round-trip execution duration">
              <Clock size={13} /> {value._meta.latencyMs}ms
            </span>
          )}
          <button type="button" className="action-btn" onClick={copyJson} title="Copy JSON output">
            {copied ? <Check size={14} color="#34d399"/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button type="button" className="action-btn" onClick={downloadJson} title="Download JSON file">
            <Download size={14}/> Export
          </button>
        </div>
      </div>
      {summary && <p className="response-summary">{summary}</p>}
      {candidates.length > 0 && <div className="candidate-grid">
        {candidates.map((c, i) => (
          <article className="candidate" key={c.index ?? i}>
            {typeof c.assetUrl === 'string' && /^https?:\/\//i.test(c.assetUrl)
              ? <img src={c.assetUrl} loading="lazy" alt={'Candidate ' + (i + 1)}/>
              : <div className="candidate-empty"><ImageIcon/><span>{c.errorMessage || 'Image not available'}</span></div>}
            <strong>Candidate {i + 1}</strong>
            <span>{c.metadata?.perspective || c.status || 'Image result'}</span>
          </article>
        ))}
      </div>}
      <details className="response-raw"><summary>View full structured response</summary><pre>{JSON.stringify(value, null, 2)}</pre></details>
    </section>
  );
}
