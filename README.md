# Orbit AI — Independent Host / AI Agent Studio External API POC

Orbit is an independent host app. Its own Node backend authenticates users,
stores accounts and local sandbox history in its SQLite database, and calls the
**real AI Agent Studio** over a shared external API credential. No separate IRMA
login, shared user database, copied agent business logic, iframe, or redirect.

## Architecture

```
Browser -> Orbit JWT -> Orbit Node/SQLite -> X-API-Key -> IRMA Node API
                                                   |-> Agnes stateless image
                                                   |-> IRMA Python analytics
```

The browser receives only safe catalog metadata and agent output; the API key
is only read by the Orbit Node process. The real Agent Studio backend owns
execution. The live catalog includes **every available DB agent plus workspace-
only catalog cards** that were present at the source audit. Some require their
own per-user IRMA authorization and are explicitly marked `blocked` instead
of being opened unsafely under a platform-level key.

## Run on Windows

Requirements: Node.js 20+, both IRMA Node (:5001) and Python (:8001) for Python
analytics, plus the existing provider configuration for live image generation.

```powershell
git pull
# Configure the same locally generated AI_AGENT_STUDIO_API_KEY in:
# 1. Ishvara-Tech/aiagent-backend/.env
# 2. python-migration/.env
.\run.ps1
```

Orbit frontend: http://127.0.0.1:3002  
Orbit backend: http://127.0.0.1:5101/api/health

On first run the launcher creates `.env` from `.env.example` if absent. On
existing installations it never overwrites local secrets. Set:

```env
AI_AGENT_STUDIO_URL=http://127.0.0.1:5001
AI_AGENT_STUDIO_API_KEY=<same-platform-secret-as-IRMA-node>
```

The **IRMA** Node backend independently needs:
```env
AI_AGENT_STUDIO_API_KEY=<same-platform-secret>
PYTHON_SERVICE_URL=http://127.0.0.1:8001
IRMA_SERVICE_SECRET=<pre-existing-shared-Node-Python-secret>
AGNES_API_KEY=<existing-provider-secret>
```
Python must have the matching `IRMA_SERVICE_SECRET` for its eight analytics
workflows. Production requires HTTPS and separate partner-scoped managed keys,
not one universal partner secret.

## What to check

1. Register/login Orbit: no IRMA login required; accounts stay in SQLite.
2. Open **AI Agent Studio**. Orbit Node calls the authenticated IRMA catalog.
3. Verify all catalog entries display, including contributor agents with
   `Not yet connected` status when no safe external adapter exists.
4. Pick an enabled analytics agent, view the real API contract and run the
   example input or paste your own JSON.
5. Pick Image Generator and run a prompt, receiving Agnes candidates if
   provider keys are configured.
6. Stop IRMA Node: Orbit should show an error without losing login/database.
7. Wrong or missing key: IRMA returns 401; Orbit passes a safe error.
8. Orbit has a separate **Local Sandbox** for its original mock content demo;
   this is not falsely presented as a real IRMA agent.

## API verification outside Orbit

The IRMA Node external API is at `http://127.0.0.1:5001/api/v1/agents`.
See the private IRMA backend `docs/external-agent-studio-api.md` for working
cURL examples. Postman collection with an entry for **every catalog agent**:
```powershell
curl.exe -H "X-API-Key: YOUR_LOCAL_KEY" http://127.0.0.1:5001/api/v1/agents/postman-collection -o AI-Agent-Studio-External-API.postman_collection.json
```
This export contains no actual API key. Import it and set `api_key` locally.

## Boundaries

- No private Ishvara source code is copied into this **public** POC repo.
- Local Orbit users cannot pretend to be IRMA users via the platform key.
- The host supplies only its verified opaque user reference on Node-to-Node calls.
- External API is currently enabled for eight submitted-data analytics
  workflows, stateless Image Generation, Content Studio ideation/outlines,
  and Webinar Conversion AI planning. Others are cataloged but need
  permission-aware adapters before execution (no fake successful endpoints).
- Existing Orbit history and local mock content demo remain usable.
- No remote send/publish/calendar side effects are triggered by catalog calls.

## Validation

```powershell
npm test --prefix backend
npm run build --prefix frontend
```
Live integration still requires both local services and configured provider keys.
