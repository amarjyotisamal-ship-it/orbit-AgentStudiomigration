import { useState, useEffect } from "react";
import { request } from "../api.js";

export function useCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCatalog() {
    setLoading(true);
    setError("");
    try {
      const data = await request("/agents/catalog");
      if (!Array.isArray(data.agents)) throw new Error("Invalid catalog format.");
      setCatalog(data);
    } catch (err) {
      setError(err.message || "Failed to load catalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCatalog(); }, []);
  return { catalog, loading, error, refreshCatalog: loadCatalog };
}
