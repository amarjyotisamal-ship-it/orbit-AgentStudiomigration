# Orbit AI — Security & Integration Architecture

## Overview

Orbit is designed as a secure, independent host application. It authenticates users locally, isolates user credentials, and communicates with the real AI Agent Studio platform through a strict server-to-server gateway boundary.

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  React 19 / Vite SPA (Port 3002)                                                |
|  - Authenticates against Orbit Node Backend only                                |
|  - Never holds or sees AI Agent Studio project credentials                       |
+---------------------------------------------------------------------------------+
                                      |
                           Orbit JWT (Bearer)
                                      v
+---------------------------------------------------------------------------------+
|                               HOST BACKEND TIER                                 |
|  Orbit Express Backend (Port 5101)                                              |
|  - Manages SQLite Database (users, saved generations, favorites)                 |
|  - Validates user identity and rate limits incoming calls                       |
|  - Derives external identity: "orbit-user-<userId>"                             |
+---------------------------------------------------------------------------------+
                                      |
                      X-Project-ID: orbit-poc
                      Authorization: Bearer <AI_AGENT_STUDIO_API_TOKEN>
                                      v
+---------------------------------------------------------------------------------+
|                             AI AGENT STUDIO TIER                                |
|  AI Agent Studio Backend (Port 5000 / 5001)                                     |
|  - Validates trusted project credentials server-to-server                       |
|  - Enforces per-user resource boundaries and sandbox isolation                  |
|  - Executes 60+ autonomous intelligence agents                                  |
+---------------------------------------------------------------------------------+
```

---

## Key Security Guarantees

1. **Zero Secret Leakage to the Browser**:
   The AI Agent Studio Project ID and API Token are stored exclusively in the host backend's environment variables (`.env`). They are never exposed in JavaScript bundles, client headers, or network responses.

2. **Strict Identity Derivation**:
   Orbit never allows clients to supply arbitrary external user IDs. Identity is derived deterministically from the verified Orbit JWT session:
   ```javascript
   const externalUserRef = `orbit-user-${Number(req.identity.sub)}`;
   ```

3. **Separate Database Storage**:
   Orbit user passwords, SQLite sessions, and local generation history are stored locally in `backend/data/poc.sqlite`. No passwords or Orbit user database tables are shared with AI Agent Studio.

4. **Fail-Closed Upstream Protection**:
   If the AI Agent Studio service is unreachable, disabled, or misconfigured, Orbit gracefully returns structured error responses (`502 Bad Gateway` or `503 Service Unavailable`) without crashing or corrupting local host state.
