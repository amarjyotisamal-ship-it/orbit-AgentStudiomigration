import React from "react";
import { Search, RefreshCw } from "lucide-react";

export function CatalogToolbar({ search, onSearchChange, searchRef, category, onCategoryChange, categories, availability, onAvailabilityChange, favoritesCount, onRefresh, loading }) {
  return (
    <div className="catalog-toolbar">
      <label className="catalog-search">
        <Search size={18}/>
        <input ref={searchRef} type="search" value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search all agents, categories, or capabilities" aria-label="Search all agents"/>
        <kbd className="search-kbd">⌘K</kbd>
      </label>
      <select aria-label="Filter by category" value={category} onChange={e => onCategoryChange(e.target.value)}>
        {categories.map(name => <option key={name} value={name}>{name}</option>)}
      </select>
      <select aria-label="Filter by API availability" value={availability} onChange={e => onAvailabilityChange(e.target.value)}>
        <option value="all">All agents</option>
        <option value="ready">API ready</option>
        <option value="blocked">Needs adapter</option>
        <option value="favorites">★ Favorites ({favoritesCount})</option>
      </select>
      <button className="refresh-btn" onClick={onRefresh} disabled={loading}><RefreshCw size={16}/> Refresh</button>
    </div>
  );
}
