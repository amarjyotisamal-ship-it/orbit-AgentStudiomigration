import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item ${t.type || 'info'}`} onClick={() => onDismiss(t.id)}>
          {t.type === 'success' ? <CheckCircle2 size={16} color="#34d399"/> : <AlertCircle size={16} color="#f87171"/>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
