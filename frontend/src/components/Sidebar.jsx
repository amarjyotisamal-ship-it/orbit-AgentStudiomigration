import React from "react";
import { Sparkles, Layers3, Braces, History, LogOut, Star } from "lucide-react";

export function Sidebar({ view, onViewChange, availableCount, totalCount, favoritesCount, savedCount, user, onLogout }) {
  return (
    <aside>
      <div className="logo"><Sparkles size={20}/> Orbit AI</div>
      <nav aria-label="Workspace navigation">
        <button className={view === 'catalog' ? 'active' : ''} onClick={() => onViewChange('catalog')}>
          <Layers3/> AI Agent Studio {totalCount > 0 && <small>{availableCount} active</small>}
          {favoritesCount > 0 && <span className="sidebar-fav-pill"><Star size={11} fill="#fbbf24" color="#fbbf24"/> {favoritesCount}</span>}
        </button>
        <button className={view === 'sandbox' ? 'active' : ''} onClick={() => onViewChange('sandbox')}><Braces/> Local demo</button>
        <button className={view === 'history' ? 'active' : ''} onClick={() => onViewChange('history')}><History/> Demo history <small>{savedCount}</small></button>
      </nav>
      <div className="side-bottom">
        <div className="user-chip">
          <div>{user?.name?.[0]?.toUpperCase() || 'O'}</div>
          <span><b>{user?.name || 'Orbit user'}</b><small>{user?.email}</small></span>
        </div>
        <button onClick={onLogout}><LogOut size={16}/> Sign out</button>
      </div>
    </aside>
  );
}
