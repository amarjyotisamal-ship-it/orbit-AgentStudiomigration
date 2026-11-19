# Orbit AI — Independent Host / AI Agent Studio External API POC

Orbit is an independent host web application. Its Node.js backend authenticates users locally,
stores accounts and local history in its own SQLite database, and connects to the
**real AI Agent Studio platform** over a secure server-to-server external API credential.

No separate IRMA login, shared user database, copied agent business logic, or iframe required.

---

## Architecture

```
Browser (React 19) -> Orbit JWT -> Orbit Node/SQLite -> X-Project-ID + Bearer token -> AI Agent Studio API
                                                                |-> Agnes stateless image generator
                                                                |-> Python analytics & model engine
```

- **Documentation**:
  - [API Specification](docs/API.md) — Complete REST endpoints and request/response contracts.
  - [Integration Architecture](docs/INTEGRATION.md) — Security boundaries, token isolation, and data policies.

---

## Features

- **Dynamic Agent Catalog**: Real-time discovery of 60+ autonomous intelligence agents from AI Agent Studio.
- **Bookmarks & Favorites**: Star favorite agents with persistent SQLite storage and quick filtering.
- **Execution Latency & Diagnostics**: Real-time round-trip latency metrics and system health indicators.
- **Export & Copy Actions**: One-click JSON export and clipboard copy for agent execution outputs.
- **Keyboard Shortcuts**: Instant search focus (`⌘K` / `Ctrl+K`) and modal dismiss (`Escape`).
- **Security & Rate Limiting**: Built-in sliding-window rate limiting on authentication and execution endpoints.
- **Independent SQLite Database**: User authentication, passwords (bcrypt), and demo records remain completely inside Orbit.

---

## Quickstart (Windows PowerShell)

Requirements: Node.js 20+ or 22+.

```powershell
git pull
# 1. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 2. Run Orbit (Frontend on 3002, Backend on 5101)
.\run.ps1
```

- **Orbit Frontend**: http://127.0.0.1:3002
- **Orbit Backend Health**: http://127.0.0.1:5101/api/health

---

## Configuration (`.env`)

Configure the following variables in `.env`:

```env
PORT=5101
JWT_SECRET=your-random-jwt-secret-string
AI_MODE=mock
AI_AGENT_STUDIO_URL=http://127.0.0.1:5000
AI_AGENT_STUDIO_PROJECT_ID=orbit-poc
AI_AGENT_STUDIO_API_TOKEN=your-32-character-server-api-token
```

---

## Testing & Quality Assurance

```powershell
# Run backend test suite (8 tests)
npm test --prefix backend

# Build frontend production bundle
npm run build --prefix frontend
```
