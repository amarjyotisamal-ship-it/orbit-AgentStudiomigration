# Security & Threat Model

## Guarantees
- **Credential Isolation**: Client browser never receives AI Agent Studio platform tokens.
- **Identity Derivation**: User references (`orbit-user-<id>`) are derived server-side from verified JWTs.
- **Database Boundary**: SQLite user credentials never leave the host machine.
- **Fail-Closed Gateways**: Missing or invalid project keys immediately fail with HTTP 503.
