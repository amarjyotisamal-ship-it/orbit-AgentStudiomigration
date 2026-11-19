import React from "react";
import { ShieldCheck } from "lucide-react";

export function ContractPanel({ agent }) {
  if (!agent) return null;
  return (
    <div className="contract-panel">
      <span className="eyebrow">INTEGRATION DETAILS</span>
      <h3>How this agent connects</h3>
      <div className="contract-row"><span>Agent ID</span><code>{agent.id}</code></div>
      <div className="contract-row"><span>Execution</span><b>{agent.externalApi ? agent.mode : 'Requires adapter'}</b></div>
      <div className="contract-row"><span>Source</span><b>{agent.source === 'workspace-only' ? 'Agent Studio workspace' : 'Live Agent Studio catalog'}</b></div>
      <div className="contract-row"><span>Access</span><b>{agent.externalApi ? 'One server API key' : 'Scoped integration needed'}</b></div>
      {agent.coverage && <div className="contract-caveat">{agent.coverage}</div>}
      <div className="contract-boundary">
        <ShieldCheck size={20}/>
        <p><strong>No second login</strong><span>Requests flow through Orbit Node. The external API key is never sent to the browser.</span></p>
      </div>
    </div>
  );
}
