import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Sparkles, LayoutDashboard, History, LogOut, ArrowRight, ShieldCheck, Database,
  Zap, Trash2, CheckCircle2, Image as ImageIcon, Search, RefreshCw,
  LockKeyhole, Braces, Play, ChevronLeft, AlertCircle, FileText,
  Server, Activity, ArrowUpRight, Layers3, Star, Copy, Download, Check
} from 'lucide-react';
import { request } from './api.js';
import './styles.css';

const saveSession = (data) => {
  localStorage.setItem('poc_token', data.token);
  localStorage.setItem('poc_user', JSON.stringify(data.user));
};
const clearSession = () => {
  localStorage.removeItem('poc_token');
  localStorage.removeItem('poc_user');
};
const textOf = (error) => error instanceof Error ? error.message : 'Something went wrong.';
const imageDefault = {
  prompt: 'A professional collaborative AI workspace with modern technology and warm natural lighting',
  style: 'Auto',
  purpose: 'Campaign Creative',
  ratio: '1:1',
};

function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await request('/auth/' + mode, { method: 'POST', body: JSON.stringify(form) });
      saveSession(data);
      onAuth(data.user);
    } catch (err) { setError(textOf(err)); }
    finally { setBusy(false); }
  }
  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="logo"><Sparkles size={20}/> Orbit AI</div>
        <div><span className="eyebrow">INDEPENDENT AI PLATFORM</span>
          <h1>One workspace.<br/>Your identity.<br/><em>Connected intelligence.</em></h1>
          <p>Access the AI Agent Studio catalog through a secure backend connection, with Orbit authentication and a separate database.</p>
        </div>
        <div className="trust-row"><span><ShieldCheck/> Own login</span><span><Database/> Own database</span><span><Zap/> Shared Agent Studio API</span></div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <div><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'CREATE WORKSPACE'}</span>
            <h2>{mode === 'login' ? 'Sign in to Orbit' : 'Create your Orbit account'}</h2>
            <p>No second IRMA login is required.</p>
          </div>
          {mode === 'register' && <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} minLength={2} placeholder="Full name"/></label>}
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com"/></label>
          <label>Password<input type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters"/></label>
          {error && <div className="error" role="alert">{error}</div>}
          <button className="primary" disabled={busy}>{busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17}/></button>
          <button className="text-button" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}

function StatusPill({ ready }) {
  return <span className={ready ? 'agent-state ready' : 'agent-state blocked'}>
    <span className="agent-state-dot"/>{ready ? 'External API ready' : 'Not externally enabled'}
  </span>;
}

function Results({ value }) {
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
        {candidates.map((candidate, index) => (
          <article className="candidate" key={candidate.index ?? index}>
            {typeof candidate.assetUrl === 'string' && /^https?:\/\//i.test(candidate.assetUrl)
              ? <img src={candidate.assetUrl} loading="lazy" alt={'Generated image candidate ' + (index + 1)}/>
              : <div className="candidate-empty"><ImageIcon/><span>{candidate.errorMessage || 'Image not available'}</span></div>}
            <strong>Candidate {index + 1}</strong>
            <span>{candidate.metadata?.perspective || candidate.status || 'Image result'}</span>
          </article>
        ))}
      </div>}
      {Array.isArray(content.missing_inputs) && content.missing_inputs.length > 0 && <div className="response-notice">
        {content.missing_inputs.map((entry, index) => <p key={index}>{entry.field_name || 'Missing input'}: {entry.description || ''}</p>)}
      </div>}
      <details className="response-raw"><summary>View full structured response</summary><pre>{JSON.stringify(value, null, 2)}</pre></details>
    </section>
  );
}

function DemoResult({ item }) {
  if (!item) return null;
  const result = item.result || item;
  return <section className="result-card">
    <div className="result-head"><div className="success-icon"><CheckCircle2/></div><div>
      <span className="eyebrow">LOCAL DEMO OUTPUT</span><h2>{result.title}</h2><p>{result.summary}</p></div></div>
    <div className="idea-grid">{(result.ideas || []).map((idea, index) => <article className="idea" key={index}>
      <span>{String(index + 1).padStart(2, '0')}</span><h3>{idea.title}</h3><p>{idea.angle}</p></article>)}</div>
    <div className="outline"><span className="eyebrow">SUGGESTED OUTLINE</span>{(result.outline || []).map((line, index) => <div key={index}><b>{index + 1}</b>{line}</div>)}</div>
  </section>;
}

function Workspace({ user, onLogout }) {
  const [view, setView] = useState('catalog');
  const [catalog, setCatalog] = useState(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const [category, setCategory] = useState('All categories');
  const [availability, setAvailability] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  async function loadFavorites() {
    try {
      const data = await request('/agents/favorites');
      if (Array.isArray(data.favorites)) setFavorites(new Set(data.favorites));
    } catch {}
  }

  async function toggleFavorite(e, agentKey) {
    e.stopPropagation();
    const isFav = favorites.has(agentKey);
    const next = new Set(favorites);
    if (isFav) {
      next.delete(agentKey);
      setFavorites(next);
      await request('/agents/favorites/' + encodeURIComponent(agentKey), { method: 'DELETE' }).catch(() => {});
    } else {
      next.add(agentKey);
      setFavorites(next);
      await request('/agents/favorites/' + encodeURIComponent(agentKey), { method: 'POST' }).catch(() => {});
    }
  }
  const [selected, setSelected] = useState(null);
  const [contract, setContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(false);
  const [agentError, setAgentError] = useState('');
  const [jsonInput, setJsonInput] = useState('{}');
  const [imageInput, setImageInput] = useState(imageDefault);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [operationName, setOperationName] = useState('');
  const selectionSerial = useRef(0);

  const [saved, setSaved] = useState([]);
  const [demo, setDemo] = useState({ topic: '', audience: 'B2B technology leaders', tone: 'Professional' });
  const [demoError, setDemoError] = useState('');
  const [demoBusy, setDemoBusy] = useState(false);
  const [latest, setLatest] = useState(null);

  async function loadCatalog() {
    setLoadingCatalog(true);
    setCatalogError('');
    try {
      const data = await request('/agents/catalog');
      if (!Array.isArray(data.agents)) throw new Error('Agent Studio returned an invalid catalog.');
      setCatalog(data);
    } catch (err) {
      setCatalogError(textOf(err));
      setCatalog(null);
    } finally { setLoadingCatalog(false); }
  }
  async function loadSaved() {
    try { const data = await request('/generations'); setSaved(data.items || []); }
    catch (err) { setDemoError(textOf(err)); }
  }
  useEffect(() => { void loadCatalog(); void loadSaved(); void loadFavorites(); }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && selected) {
        backToCatalog();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  const agents = catalog?.agents || [];
  const availableCount = agents.filter(a => a.externalApi).length;
  const categories = useMemo(() => ['All categories', ...new Set(agents.map(a => a.category || 'Other'))].sort((a, b) => a === 'All categories' ? -1 : b === 'All categories' ? 1 : a.localeCompare(b)), [catalog]);
  const filteredAgents = useMemo(() => agents.filter(agent => {
    if (category !== 'All categories' && (agent.category || 'Other') !== category) return false;
    if (availability === 'ready' && !agent.externalApi) return false;
    if (availability === 'blocked' && agent.externalApi) return false;
    if (availability === 'favorites' && !favorites.has(agent.id) && !favorites.has(agent.capabilityId)) return false;
    const key = search.toLowerCase().trim();
    return !key || [agent.name, agent.id, agent.category, agent.description, agent.capabilityId].some(value => String(value || '').toLowerCase().includes(key));
  }), [catalog, search, category, availability, favorites]);

  async function openAgent(agent) {
    const serial = ++selectionSerial.current;
    setSelected(agent); setContract(null); setAgentError(''); setOutput(null);
    setJsonInput('{}'); setImageInput(imageDefault); setOperationName('');
    if (!agent.externalApi) return;
    setLoadingContract(true);
    try {
      const details = await request('/agents/' + encodeURIComponent(agent.id) + '/contract');
      if (serial !== selectionSerial.current) return;
      setContract(details);
      const firstAction = details.operations?.[0]?.name || details.mode || '';
      setOperationName(firstAction);
      if (details.mode === 'generate') setImageInput({ ...imageDefault, ...(details.exampleInput || {}) });
      else setJsonInput(JSON.stringify(details.examples?.[firstAction] || details.exampleInput || {}, null, 2));
    } catch (err) {
      if (serial === selectionSerial.current) setAgentError(textOf(err));
    } finally {
      if (serial === selectionSerial.current) setLoadingContract(false);
    }
  }
  function backToCatalog() {
    selectionSerial.current += 1;
    setSelected(null); setContract(null); setOutput(null); setAgentError(''); setLoadingContract(false);
  }
  async function runAgent(event) {
    event.preventDefault();
    if (!selected?.externalApi || !contract) return;
    setAgentError(''); setOutput(null);
    let data;
    try {
      data = contract.mode === 'generate' ? imageInput : JSON.parse(jsonInput);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Input must be a JSON object.');
    } catch {
      setAgentError('Enter valid JSON request data before running the agent.');
      return;
    }
    const operation = contract.operations?.find(op => op.name === operationName);
    if (!operation) { setAgentError('This agent has no supported external operation.'); return; }
    setRunning(true);
    try {
      const response = await request('/agents/' + encodeURIComponent(selected.id) + '/' + encodeURIComponent(operation.name), {
        method: 'POST', body: JSON.stringify({ input: data }),
      });
      setOutput(response);
    } catch (err) { setAgentError(textOf(err)); }
    finally { setRunning(false); }
  }
  async function generateDemo(event) {
    event.preventDefault(); setDemoError(''); setDemoBusy(true);
    try {
      const response = await request('/generations', { method: 'POST', body: JSON.stringify(demo) });
      setLatest(response); await loadSaved();
    } catch (err) { setDemoError(textOf(err)); }
    finally { setDemoBusy(false); }
  }
  async function removeSaved(id) {
    try {
      await request('/generations/' + id, { method: 'DELETE' });
      if (latest?.id === id) setLatest(null);
      await loadSaved();
    } catch (err) { setDemoError(textOf(err)); }
  }

  return (
    <div className="app-shell">
      <aside>
        <div className="logo"><Sparkles size={20}/> Orbit AI</div>
        <nav aria-label="Workspace navigation">
          <button className={view === 'catalog' ? 'active' : ''} onClick={() => { setView('catalog'); backToCatalog(); }}>
            <Layers3/> AI Agent Studio {catalog && <small>{agents.length}</small>}
          </button>
          <button className={view === 'sandbox' ? 'active' : ''} onClick={() => setView('sandbox')}><Braces/> Local demo</button>
          <button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}><History/> Demo history <small>{saved.length}</small></button>
        </nav>
        <div className="side-bottom">
          <div className="user-chip"><div>{user?.name?.[0]?.toUpperCase() || 'O'}</div><span><b>{user?.name || 'Orbit user'}</b><small>{user?.email}</small></span></div>
          <button onClick={onLogout}><LogOut/> Sign out</button>
        </div>
      </aside>
      <main className="workspace">
        <header className="page-header">
          <div><span className="eyebrow">ORBIT / EXTERNAL AI PLATFORM</span>
            <h1>{view === 'catalog' ? 'AI Agent Studio' : view === 'sandbox' ? 'Local sandbox' : 'Saved demo history'}</h1></div>
          <div className="header-status-area">
            {catalog?._meta?.latencyMs != null && (
              <span className="latency-badge" title="Live Agent Studio catalog round-trip latency">
                <Activity size={12} /> {catalog._meta.latencyMs}ms
              </span>
            )}
            <span className="status"><i/> Orbit database connected</span>
          </div>
        </header>

        {view === 'catalog' && !selected && <>
          <section className="catalog-hero">
            <div><span className="pill"><Server size={14}/> API-CONNECTED AGENT WORKSPACE</span>
              <h2>One integration.<br/><em>Your complete agent catalog.</em></h2>
              <p>Discover all agents from the existing AI Agent Studio. Workflows requiring extra permissions remain visible and clearly marked until a safe external adapter is available.</p>
            </div>
            <div className="hero-shield"><LockKeyhole size={28}/><b>Server-side API access</b><span>The platform key stays in Orbit Node. Your login and data remain here.</span></div>
          </section>
          <div className="catalog-stats">
            <div><span>Discovered agents</span><strong>{catalog ? catalog.count : '—'}</strong><small>From live Studio catalog</small></div>
            <div><span>External API ready</span><strong>{catalog ? availableCount : '—'}</strong><small>Real API operations</small></div>
            <div><span>Awaiting adapter</span><strong>{catalog ? agents.length - availableCount : '—'}</strong><small>Not silently omitted</small></div>
          </div>
          {catalogError && <div className="catalog-alert" role="alert"><AlertCircle/><div><b>Cannot load the real Agent Studio catalog</b><p>{catalogError} Orbit login and your local database remain available.</p></div><button onClick={loadCatalog}>Retry</button></div>}
          <div className="catalog-toolbar">
            <label className="catalog-search">
              <Search size={18}/>
              <input ref={searchRef} type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all agents, categories, or capabilities" aria-label="Search all agents"/>
              <kbd className="search-kbd">⌘K</kbd>
            </label>
            <select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <select aria-label="Filter by API availability" value={availability} onChange={e => setAvailability(e.target.value)}>
              <option value="all">All agents</option>
              <option value="ready">API ready</option>
              <option value="blocked">Needs adapter</option>
              <option value="favorites">★ Favorites ({favorites.size})</option>
            </select>
            <button className="refresh-btn" onClick={loadCatalog} disabled={loadingCatalog}><RefreshCw size={16}/> Refresh</button>
          </div>
          <div className="catalog-list-heading"><h3>{loadingCatalog ? 'Loading agents…' : filteredAgents.length + ' agents'}</h3><span>{catalog ? 'Live metadata via Orbit Node' : 'Waiting for Agent Studio'}</span></div>
          {!loadingCatalog && catalog && filteredAgents.length === 0 && <div className="catalog-empty">No agents match your search or filters.</div>}
          <section className="agent-grid" aria-label="AI Agent Studio catalog">
            {filteredAgents.map(agent => <button className="agent-tile" key={agent.id} onClick={() => openAgent(agent)}>
              <span className="tile-top">
                <span className="tile-icon">{agent.mode === 'generate' ? <ImageIcon/> : agent.externalApi ? <Activity/> : <Layers3/>}</span>
                <span className="tile-actions">
                  <button
                    type="button"
                    className={`fav-star-btn ${favorites.has(agent.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, agent.id)}
                    title={favorites.has(agent.id) ? 'Remove bookmark' : 'Bookmark agent'}
                  >
                    <Star size={14} fill={favorites.has(agent.id) ? '#fbbf24' : 'none'} color={favorites.has(agent.id) ? '#fbbf24' : '#64748b'} />
                  </button>
                  <StatusPill ready={agent.externalApi}/>
                </span>
              </span>
              <span className="tile-category">{agent.category || 'Agent Studio'}</span>
              <strong>{agent.name}</strong><span className="tile-description">{agent.description || 'Agent workflow and capability.'}</span>
              <span className="tile-foot"><small>{agent.externalApi ? 'Open external agent' : 'View integration status'}</small><ArrowUpRight size={16}/></span>
            </button>)}
          </section>
        </>}

        {view === 'catalog' && selected && <section className="agent-workspace">
          <button className="back-link" onClick={backToCatalog}><ChevronLeft size={16}/> All agents</button>
          <div className="agent-detail-intro"><div>
            <span className="eyebrow">{selected.category || 'AI AGENT STUDIO'}</span>
            <h2>{selected.name}</h2><p>{selected.description || 'An existing Agent Studio capability.'}</p>
          </div><StatusPill ready={selected.externalApi}/></div>
          <div className="execution-layout">
            <div className="execution-panel">
              {selected.externalApi ? <>
                <div className="execution-title"><Play size={19}/><div><h3>Run existing agent</h3><p>Orbit calls the real Agent Studio API using your Orbit session.</p></div></div>
                {loadingContract ? <p className="muted">Loading the actual API contract…</p> :
                  <form onSubmit={runAgent}>
                    {contract?.operations?.length > 1 && <label>Operation
                      <select value={operationName} onChange={event => {
                        const action = event.target.value;
                        setOperationName(action); setOutput(null);
                        setJsonInput(JSON.stringify(contract.examples?.[action] || {}, null, 2));
                      }}>
                        {contract.operations.map(op => <option key={op.name} value={op.name}>{op.name === 'ideate' ? 'Generate ideas' : op.name === 'outline' ? 'Generate outline' : op.name}</option>)}
                      </select>
                    </label>}
                    {contract?.mode === 'generate' ? <>
                      <label>Creative prompt<textarea required minLength={8} value={imageInput.prompt} onChange={e => setImageInput({ ...imageInput, prompt: e.target.value })}/></label>
                      <div className="form-split">
                        <label>Visual style<input value={imageInput.style} maxLength={50} onChange={e => setImageInput({ ...imageInput, style: e.target.value })}/></label>
                        <label>Aspect ratio<select value={imageInput.ratio} onChange={e => setImageInput({ ...imageInput, ratio: e.target.value })}>{['Auto','1:1','4:5','16:9','9:16','3:2'].map(x => <option key={x}>{x}</option>)}</select></label>
                      </div>
                      <label>Campaign purpose<input maxLength={50} value={imageInput.purpose} onChange={e => setImageInput({ ...imageInput, purpose: e.target.value })}/></label>
                    </> : <>
                      <label>Input data <span className="label-note">JSON · loaded from the existing API contract</span>
                        <textarea className="json-editor" spellCheck={false} value={jsonInput} onChange={e => setJsonInput(e.target.value)} required aria-label="Agent input JSON"/></label>
                    </>}
                    <button className="primary" disabled={running || !contract}>
                      <Zap size={17}/>{running ? 'Executing existing agent…' : 'Run through Agent Studio API'}
                    </button>
                  </form>}
              </> : <div className="blocked-workflow"><LockKeyhole size={26}/><h3>External adapter not available</h3>
                <p>This agent is present in the real Agent Studio catalog but requires a permission-aware API adapter. A platform key alone does not grant access to another user's saved data or connected accounts.</p>
                <div>{selected.reason || 'This workflow is not available for external execution yet.'}</div>
              </div>}
              {agentError && <div className="catalog-alert compact" role="alert"><AlertCircle size={18}/><span>{agentError}</span></div>}
            </div>
            <div className="contract-panel"><span className="eyebrow">INTEGRATION DETAILS</span>
              <h3>How this agent connects</h3>
              <div className="contract-row"><span>Agent ID</span><code>{selected.id}</code></div>
              <div className="contract-row"><span>Execution</span><b>{selected.externalApi ? selected.mode : 'Requires adapter'}</b></div>
              <div className="contract-row"><span>Source</span><b>{selected.source === 'workspace-only' ? 'Agent Studio workspace' : 'Live Agent Studio catalog'}</b></div>
              <div className="contract-row"><span>Access</span><b>{selected.externalApi ? 'One server API key' : 'Scoped integration needed'}</b></div>
              {selected.coverage && <div className="contract-caveat">{selected.coverage}</div>}
              <div className="contract-boundary"><ShieldCheck size={20}/><p><strong>No second login</strong><span>Requests flow through Orbit Node. The external API key is never sent to the browser.</span></p></div>
            </div>
          </div>
          <Results value={output}/>
        </section>}

        {view === 'sandbox' && <div className="demo-view">
          <section className="catalog-hero"><div><span className="pill"><Braces size={14}/> LOCAL DEMONSTRATION</span>
            <h2>Orbit's own <em>content sandbox.</em></h2>
            <p>This independent mock workflow is not represented as an IRMA agent. It demonstrates local Orbit accounts, generation history and database persistence.</p></div></section>
          <section className="studio-grid">
            <form className="composer" onSubmit={generateDemo}>
              <div className="section-title"><span>01</span><div><h3>Generate content direction</h3><p>Stored in Orbit's own database.</p></div></div>
              <label>Topic or objective<textarea required minLength={5} value={demo.topic} onChange={e => setDemo({ ...demo, topic: e.target.value })} placeholder="e.g. AI operations for enterprise teams"/></label>
              <label>Audience<input value={demo.audience} onChange={e => setDemo({ ...demo, audience: e.target.value })}/></label>
              <label>Tone<select value={demo.tone} onChange={e => setDemo({ ...demo, tone: e.target.value })}>{['Professional','Executive','Conversational','Technical'].map(x => <option key={x}>{x}</option>)}</select></label>
              <button className="primary" disabled={demoBusy}><Sparkles size={18}/>{demoBusy ? 'Generating…' : 'Generate local demo'}</button>
            </form>
            <div className="architecture"><span className="eyebrow">SEPARATE DATABASES</span><h3>Independent host boundary</h3>
              <div><ShieldCheck/><p><b>Orbit authentication</b><small>Your session and password remain in Orbit.</small></p></div>
              <div><Database/><p><b>Orbit SQLite</b><small>Demo history is saved locally under your account.</small></p></div>
              <div><Server/><p><b>Agent Studio API</b><small>Real agents are available from the catalog, not copied here.</small></p></div>
            </div>
          </section>
          {demoError && <div className="catalog-alert compact" role="alert"><AlertCircle size={18}/>{demoError}</div>}
          <DemoResult item={latest}/>
        </div>}

        {view === 'history' && <section className="history-list">
          <div className="section-title"><History/><div><h3>Orbit local demo history</h3><p>These records are stored in Orbit, not the IRMA database.</p></div></div>
          {demoError && <div className="error" role="alert">{demoError}</div>}
          {saved.length === 0 ? <div className="empty"><History size={28}/><h3>No saved demo generations</h3><p>Use the local demo to add one.</p></div>
            : saved.map(item => <article className="history-item" key={item.id}>
              <div><span className="eyebrow">{item.createdAt} · {item.provider}</span><h3>{item.result?.title || item.topic}</h3><p>{item.result?.summary}</p>
                <button className="history-open" onClick={() => { setLatest(item); setView('sandbox'); }}>Open demo</button>
              </div><button aria-label="Delete saved demo" onClick={() => removeSaved(item.id)}><Trash2 size={18}/></button>
            </article>)}
        </section>}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('poc_user')); } catch { return null; }
  });
  useEffect(() => {
    if (user && localStorage.getItem('poc_token')) {
      request('/me').then(data => setUser(data.user)).catch(() => { clearSession(); setUser(null); });
    }
  }, []);
  return user ? <Workspace user={user} onLogout={() => { clearSession(); setUser(null); }}/> : <Auth onAuth={setUser}/>;
}
createRoot(document.getElementById('root')).render(<App/>);
