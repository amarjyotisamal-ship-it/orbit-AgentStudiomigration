import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudioCatalog, executeStudioAgent, AgentStudioUpstreamError } from '../src/agentStudioClient.js';

const saved = { projectId: process.env.AI_AGENT_STUDIO_PROJECT_ID, token: process.env.AI_AGENT_STUDIO_API_TOKEN, url: process.env.AI_AGENT_STUDIO_URL, fetch: globalThis.fetch };
const PROJECT_ID = 'orbit-poc';
const TOKEN = 'test-only-orbit-server-token-32-characters-long';

test('Orbit proxy keeps one platform key server-side, and derives the user identity', async () => {
  process.env.AI_AGENT_STUDIO_PROJECT_ID = PROJECT_ID;
  process.env.AI_AGENT_STUDIO_API_TOKEN = TOKEN;
  process.env.AI_AGENT_STUDIO_URL = 'http://127.0.0.1:5001';
  const sent = [];
  globalThis.fetch = async (url, opts) => {
    sent.push({ url, opts });
    return new Response(JSON.stringify(
      url.endsWith('/catalog') ?
        { agents: [{ id: 'b2b_saas_roi_analyst', capabilityId: 'IRMA-20-03', externalApi: true, operations: [{ name: 'analyze' }] }] } :
        { status: 'completed', output: { roi_percentage: 20 } }
    ), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const result = await executeStudioAgent({
      agentId: 'IRMA-20-03', action: 'analyze', input: { investment_cost: 100, attributed_revenue: 120 },
      userId: 11,
    });
    assert.equal(result.output.roi_percentage, 20);
    assert.equal(sent.length, 2);
    assert.equal(sent[0].opts.headers['X-Project-ID'], PROJECT_ID);
    assert.equal(sent[1].opts.headers['X-Project-ID'], PROJECT_ID);
    assert.equal(sent[0].opts.headers.Authorization, 'Bearer ' + TOKEN);
    assert.equal(sent[1].opts.headers.Authorization, 'Bearer ' + TOKEN);
    const request = JSON.parse(sent[1].opts.body);
    assert.deepEqual(request.context, { externalUserRef: 'orbit-user-11' });
    assert.equal(JSON.stringify(request).includes(TOKEN), false);
  } finally { globalThis.fetch = saved.fetch; process.env.AI_AGENT_STUDIO_PROJECT_ID = saved.projectId; process.env.AI_AGENT_STUDIO_API_TOKEN = saved.token; process.env.AI_AGENT_STUDIO_URL = saved.url; }
});

test('disabled agent and caller-provided unsupported operation fail before execution', async () => {
  process.env.AI_AGENT_STUDIO_PROJECT_ID = PROJECT_ID;
  process.env.AI_AGENT_STUDIO_API_TOKEN = TOKEN;
  process.env.AI_AGENT_STUDIO_URL = 'http://127.0.0.1:5001';
  globalThis.fetch = async () => new Response(JSON.stringify({ agents: [
    { id: 'other_agent', externalApi: false, operations: [] },
  ] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  try {
    await assert.rejects(() => executeStudioAgent({ agentId: 'other_agent', action: 'analyze', input: {}, userId: 1 }),
      error => error instanceof AgentStudioUpstreamError && error.status === 409);
    await assert.rejects(() => executeStudioAgent({ agentId: 'other_agent', action: 'delete', input: {}, userId: 1 }),
      error => error instanceof AgentStudioUpstreamError && error.status === 400);
  } finally { globalThis.fetch = saved.fetch; process.env.AI_AGENT_STUDIO_PROJECT_ID = saved.projectId; process.env.AI_AGENT_STUDIO_API_TOKEN = saved.token; process.env.AI_AGENT_STUDIO_URL = saved.url; }
});

test('missing project credentials fail closed', async () => {
  process.env.AI_AGENT_STUDIO_API_TOKEN = '';
  try {
    await assert.rejects(getStudioCatalog, error => error instanceof AgentStudioUpstreamError && error.status === 503);
  } finally { process.env.AI_AGENT_STUDIO_PROJECT_ID = saved.projectId; process.env.AI_AGENT_STUDIO_API_TOKEN = saved.token; }
});
