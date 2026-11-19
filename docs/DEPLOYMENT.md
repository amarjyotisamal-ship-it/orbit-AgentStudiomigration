# Production Deployment Runbook

## Requirements
- Node.js 20.x or 22.x LTS
- HTTPS termination via Reverse Proxy (Nginx, Caddy, or Cloudflare)

## Environment Variables
- `PORT`: Set to desired internal port (e.g., 5101)
- `JWT_SECRET`: 64+ character random hex string
- `AI_AGENT_STUDIO_URL`: Production URL of AI Agent Studio backend
- `AI_AGENT_STUDIO_PROJECT_ID`: Trusted project ID
- `AI_AGENT_STUDIO_API_TOKEN`: 32+ byte server-to-server authorization token
