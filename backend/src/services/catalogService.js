export class CatalogService {
  static filterAgents(agents, { search = '', category = 'all', readyOnly = false } = {}) {
    if (!Array.isArray(agents)) return [];
    const query = search.toLowerCase().trim();
    return agents.filter(a => {
      if (category !== 'all' && (a.category || 'Other').toLowerCase() !== category.toLowerCase()) return false;
      if (readyOnly && !a.externalApi) return false;
      if (!query) return true;
      return [a.name, a.id, a.category, a.description].some(v => String(v || '').toLowerCase().includes(query));
    });
  }
}
