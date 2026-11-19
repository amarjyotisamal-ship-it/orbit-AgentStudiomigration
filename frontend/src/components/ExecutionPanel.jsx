import React from "react";
import { Play, Zap, LockKeyhole } from "lucide-react";

export function ExecutionPanel({ agent, contract, loadingContract, onSubmit, running, jsonInput, onJsonChange, imageInput, onImageChange, operationName, onOperationChange }) {
  if (!agent.externalApi) {
    return (
      <div className="blocked-workflow">
        <LockKeyhole size={26}/>
        <h3>External adapter not available</h3>
        <p>This agent is present in the real Agent Studio catalog but requires a permission-aware API adapter.</p>
        <div>{agent.reason || 'This workflow is not available for external execution yet.'}</div>
      </div>
    );
  }

  return (
    <div className="execution-panel">
      <div className="execution-title">
        <Play size={19}/>
        <div>
          <h3>Run existing agent</h3>
          <p>Orbit calls the real Agent Studio API using your Orbit session.</p>
        </div>
      </div>
      {loadingContract ? (
        <p className="muted">Loading API contract…</p>
      ) : (
        <form onSubmit={onSubmit}>
          {contract?.operations?.length > 1 && (
            <label>
              Operation
              <select value={operationName} onChange={e => onOperationChange(e.target.value)}>
                {contract.operations.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
              </select>
            </label>
          )}
          {contract?.mode === 'generate' ? (
            <>
              <label>Prompt<textarea required rows={3} value={imageInput.prompt} onChange={e => onImageChange({ ...imageInput, prompt: e.target.value })}/></label>
              <div className="form-split">
                <label>Style<select value={imageInput.style} onChange={e => onImageChange({ ...imageInput, style: e.target.value })}>{['Auto','Photographic','Digital Art','Cinematic','Minimalist'].map(s => <option key={s}>{s}</option>)}</select></label>
                <label>Aspect Ratio<select value={imageInput.ratio} onChange={e => onImageChange({ ...imageInput, ratio: e.target.value })}>{['Auto','1:1','4:5','16:9','9:16','3:2'].map(r => <option key={r}>{r}</option>)}</select></label>
              </div>
            </>
          ) : (
            <label>Request payload JSON<textarea className="json-editor" rows={8} value={jsonInput} onChange={e => onJsonChange(e.target.value)}/></label>
          )}
          <button className="primary" disabled={running}>
            <Zap size={17}/> {running ? 'Executing agent…' : 'Run through Agent Studio API'}
          </button>
        </form>
      )}
    </div>
  );
}
