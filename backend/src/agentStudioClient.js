// Orbit owns authentication. The AI Agent Studio key is confined to this Node process.
const agentKeyPattern = /^[A-Za-z0-9_.-]{1,120}$/;
const allowedActions = new Set(['analyze', 'generate', 'ideate', 'outline', 'plan']);

export class AgentStudioUpstreamError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AgentStudioUpstreamError';
    this.status = status;
  }
}

function serviceConfig() {
  const base = String(process.env.AI_AGENT_STUDIO_URL || 'http://127.0.0.1:5001').trim();
  const key = String(process.env.AI_AGENT_STUDIO_API_KEY || '');
  if (Buffer.byteLength(key, 'utf8') < 32) {
    throw new AgentStudioUpstreamError(503, 'AI Agent Studio is not configured. Add the platform API key to the Orbit server environment.');
  }
  let parsed;
  try { parsed = new URL(base); } catch {
    throw new AgentStudioUpstreamError(503, 'AI Agent Studio server address is invalid.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
    throw new AgentStudioUpstreamError(503, 'AI Agent Studio server address is invalid.');
  }
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new AgentStudioUpstreamError(503, 'Production AI Agent Studio requires HTTPS.');
  }
  return { base: parsed.origin, key };
}

async function studioCall(path, { method = 'GET', payload, timeoutMs = 20000 } = {}) {
  const { base, key } = serviceConfig();
  let response;
  try {
    response = await fetch(base + '/api/v1/agents/' + path, {
      method,
      headers: { 'X-API-Key': key, ...(payload ? { 'Content-Type': 'application/json' } : {}) },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new AgentStudioUpstreamError(503, 'AI Agent Studio is unreachable. Check the Node service and its URL.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const safeMessage = typeof data?.error?.message === 'string' ? data.error.message :
      typeof data?.message === 'string' ? data.message : 'AI Agent Studio request failed.';
    throw new AgentStudioUpstreamError(
      [400, 401, 403, 404, 409, 422, 429, 502, 503, 504].includes(response.status) ? response.status : 502,
      safeMessage
    );
  }
  return data;
}

export const isValidAgentId = (id) => agentKeyPattern.test(String(id || ''));
export const isValidAction = (action) => allowedActions.has(action);

export async function getStudioCatalog() {
  const response = await studioCall('catalog');
  if (!response || !Array.isArray(response.agents)) {
    throw new AgentStudioUpstreamError(502, 'AI Agent Studio returned an invalid catalog.');
  }
  return response;
}

export async function getAgentContract(id) {
  if (!isValidAgentId(id)) throw new AgentStudioUpstreamError(400, 'Invalid agent ID.');
  return studioCall('external/' + encodeURIComponent(id) + '/contract');
}

export async function executeStudioAgent({ agentId, action, input, userId }) {
  if (!isValidAgentId(agentId) || !isValidAction(action)) {
    throw new AgentStudioUpstreamError(400, 'Invalid agent ID or operation.');
  }
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AgentStudioUpstreamError(401, 'Authenticated Orbit user required.');
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AgentStudioUpstreamError(422, 'Provide an input JSON object.');
  }
  const catalog = await getStudioCatalog();
  const agent = catalog.agents.find(a => a.id === agentId || a.capabilityId === agentId);
  if (!agent) throw new AgentStudioUpstreamError(404, 'Agent not found in the studio catalog.');
  if (!agent.externalApi || !agent.operations?.some(o => o.name === action)) {
    throw new AgentStudioUpstreamError(409, 'This agent is listed but its external workflow is not yet safely enabled.');
  }
  // No untrusted request context or impersonated IRMA user can be passed through.
  // This user reference is bound to the verified Orbit JWT and existing Orbit DB record.
  return studioCall('external/' + encodeURIComponent(agentId) + '/' + action, {
    method: 'POST',
    payload: { context: { platformRef: 'orbit', externalUserRef: 'orbit-user-' + userId }, input },
    timeoutMs: action === 'generate' ? 145000 : 105000,
  });
}
