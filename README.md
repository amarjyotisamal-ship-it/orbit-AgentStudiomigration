# Orbit AI — Python Migration POC

Standalone dynamic web application for proving that an independently authenticated host product can later consume IRMA Python AI intelligence without sharing its login or user database.

**Milestone 1 intentionally does not copy or connect Ishvara/IRMA Python code.** It proves the host application end to end and leaves a controlled AI boundary for the next phase.

## Implemented

- React/Vite responsive frontend
- Registration and login
- bcrypt password hashing
- JWT-protected APIs
- Independent SQLite user/content database
- User-scoped saved generations
- AI Content Studio workflow
- Persistent history and delete
- Session restoration and health endpoint
- Local deterministic AI adapter for zero-key testing
- Isolated Python-service adapter ready for phase 2
- No committed secrets

## Architecture

```text
Browser / React
      |
      v
POC Node backend
  |         |
  |         +--> SQLite (users + saved generations)
  |
  +--> AI adapter
          |
          +--> mock       [current POC]
          |
          +--> Python API [next phase]
```

The host owns authentication, authorization, users and persistence. The future Python service receives only a trusted opaque user reference plus AI input.

## Run on Windows

Prerequisite: Node.js 20+.

```powershell
git clone https://github.com/amarjyotisamal-ship-it/python-migration.git
cd python-migration
.\run.ps1
```

The launcher creates a local `.env` with a random JWT secret, installs missing dependencies and starts both services.

Open:
- Frontend: http://127.0.0.1:3002
- Backend health: http://127.0.0.1:5001/api/health

## Acceptance flow

1. Register a new account.
2. Sign in.
3. Open AI Studio.
4. Enter a topic, audience and tone.
5. Generate a content direction.
6. Confirm three ideas plus an outline appear.
7. Open History and confirm the result is saved.
8. Sign out and sign back in.
9. Confirm the same history remains.
10. Delete a generation and confirm it disappears.

The local database is `backend/data/poc.sqlite` and is git-ignored.

## AI boundary

`backend/src/aiAdapter.js` is the only application module that knows how AI is reached.

Current:
```env
AI_MODE=mock
```

Next phase:
```env
AI_MODE=python
PYTHON_AI_URL=http://127.0.0.1:8001
PYTHON_AI_SERVICE_KEY=...
```

Python mode is designed to call `POST /v1/content/ideas` with an `X-Service-Key` and a small body containing an opaque `userRef` plus topic/audience/tone. We will adapt the real IRMA Python Content Studio only after this standalone host is verified locally.

## Validation

```powershell
npm test --prefix backend
npm run build --prefix frontend
```

## Security scope

This is a local architecture POC, not a production identity design. Production should add the team's approved auth/token strategy, managed secrets, HTTPS, rate limiting, observability, production database lifecycle and workload/service identity for Node-to-Python calls.

No code here modifies any Ishvara repository.
