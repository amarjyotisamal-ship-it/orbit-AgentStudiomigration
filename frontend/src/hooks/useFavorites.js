import { useState, useEffect } from "react";
import { request } from "../api.js";

export function useFavorites() {
  const [favorites, setFavorites] = useState(new Set());

  async function loadFavorites() {
    try {
      const res = await request("/agents/favorites");
      if (Array.isArray(res.favorites)) setFavorites(new Set(res.favorites));
    } catch {}
  }

  async function toggleFavorite(agentKey) {
    const isFav = favorites.has(agentKey);
    const next = new Set(favorites);
    if (isFav) {
      next.delete(agentKey);
      setFavorites(next);
      await request(`/agents/favorites/${encodeURIComponent(agentKey)}`, { method: "DELETE" }).catch(() => {});
    } else {
      next.add(agentKey);
      setFavorites(next);
      await request(`/agents/favorites/${encodeURIComponent(agentKey)}`, { method: "POST" }).catch(() => {});
    }
  }

  useEffect(() => { void loadFavorites(); }, []);
  return { favorites, toggleFavorite, refreshFavorites: loadFavorites };
}
