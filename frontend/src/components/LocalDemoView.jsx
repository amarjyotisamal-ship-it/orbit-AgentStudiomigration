import React from "react";
import { Braces, Sparkles, ShieldCheck, Database, Server, AlertCircle } from "lucide-react";
import { DemoResult } from "./DemoResult.jsx";

export function LocalDemoView({ demo, onDemoChange, onGenerate, demoBusy, demoError, latest }) {
  return (
    <div className="demo-view">
      <section className="catalog-hero">
        <div>
          <span className="pill"><Braces size={14}/> LOCAL DEMONSTRATION</span>
          <h2>Orbit's own <em>content sandbox.</em></h2>
          <p>This independent mock workflow is not represented as an IRMA agent. It demonstrates local Orbit accounts, generation history and database persistence.</p>
        </div>
      </section>
      <section className="studio-grid">
        <form className="composer" onSubmit={onGenerate}>
          <div className="section-title">
            <span>01</span>
            <div><h3>Generate content direction</h3><p>Stored in Orbit's own database.</p></div>
          </div>
          <label>Topic or objective<textarea required minLength={5} value={demo.topic} onChange={e => onDemoChange({ ...demo, topic: e.target.value })} placeholder="e.g. AI operations for enterprise teams"/></label>
          <label>Audience<input value={demo.audience} onChange={e => onDemoChange({ ...demo, audience: e.target.value })}/></label>
          <label>Tone<select value={demo.tone} onChange={e => onDemoChange({ ...demo, tone: e.target.value })}>{['Professional','Executive','Conversational','Technical'].map(x => <option key={x}>{x}</option>)}</select></label>
          <button className="primary" disabled={demoBusy}><Sparkles size={18}/>{demoBusy ? 'Generating…' : 'Generate local demo'}</button>
        </form>
        <div className="architecture">
          <span className="eyebrow">SEPARATE DATABASES</span>
          <h3>Independent host boundary</h3>
          <div><ShieldCheck/><p><b>Orbit authentication</b><small>Your session and password remain in Orbit.</small></p></div>
          <div><Database/><p><b>Orbit SQLite</b><small>Demo history is saved locally under your account.</small></p></div>
          <div><Server/><p><b>Agent Studio API</b><small>Real agents are available from the catalog, not copied here.</small></p></div>
        </div>
      </section>
      {demoError && <div className="catalog-alert compact" role="alert"><AlertCircle size={18}/>{demoError}</div>}
      <DemoResult item={latest}/>
    </div>
  );
}
