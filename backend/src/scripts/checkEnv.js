export function checkEnvironment(env = process.env) {
  const missing = [];
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");
  if (!env.AI_AGENT_STUDIO_PROJECT_ID) missing.push("AI_AGENT_STUDIO_PROJECT_ID");
  if (!env.AI_AGENT_STUDIO_API_TOKEN) missing.push("AI_AGENT_STUDIO_API_TOKEN");
  return {
    valid: missing.length === 0,
    missing
  };
}
