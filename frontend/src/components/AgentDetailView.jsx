import React from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { StatusPill } from "./StatusPill.jsx";
import { ExecutionPanel } from "./ExecutionPanel.jsx";
import { ContractPanel } from "./ContractPanel.jsx";
import { Results } from "./Results.jsx";

export function AgentDetailView({ agent, onBack, contract, loadingContract, onSubmit, running, jsonInput, onJsonChange, imageInput, onImageChange, operationName, onOperationChange, agentError, output }) {
  if (!agent) return null;
  return (
    <section className="agent-workspace">
      <button className="back-link" onClick={onBack}><ChevronLeft size={16}/> All agents</button>
      <div className="agent-detail-intro">
        <div>
          <span className="eyebrow">{agent.category || 'AI AGENT STUDIO'}</span>
          <h2>{agent.name}</h2>
          <p>{agent.description || 'An existing Agent Studio capability.'}</p>
        </div>
        <StatusPill ready={agent.externalApi}/>
      </div>
      <div className="execution-layout">
        <ExecutionPanel
          agent={agent}
          contract={contract}
          loadingContract={loadingContract}
          onSubmit={onSubmit}
          running={running}
          jsonInput={jsonInput}
          onJsonChange={onJsonChange}
          imageInput={imageInput}
          onImageChange={onImageChange}
          operationName={operationName}
          onOperationChange={onOperationChange}
        />
        <ContractPanel agent={agent} />
      </div>
      {agentError && <div className="catalog-alert compact" role="alert"><AlertCircle size={18}/><span>{agentError}</span></div>}
      <Results value={output}/>
    </section>
  );
}
