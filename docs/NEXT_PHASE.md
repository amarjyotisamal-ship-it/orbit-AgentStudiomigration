# Next phase: connect the real Python AI backend

Do this only after the standalone POC is pulled and verified locally.

## Objective

Replace the local mock adapter with one real Python intelligence path while keeping:

- POC login unchanged
- POC users unchanged
- POC SQLite database unchanged
- browser-to-Node flow unchanged

## First candidate

Content Studio is the preferred first integration because its Python workflow already separates typed intelligence from application-owned state.

## Migration work

1. Identify the smallest Content Studio Python dependency graph for ideation.
2. Separate IRMA tenant/storage assumptions from the intelligence function.
3. Expose an internal service endpoint matching the POC contract.
4. Authenticate Node-to-Python service traffic.
5. Pass opaque host context, not passwords or browser JWTs.
6. Map Python structured output to the existing POC result contract.
7. Test provider unavailable, timeout, malformed input and unauthorized service calls.
8. Only after success, evaluate Call Summary as a second agent.

## Success criterion

Changing `AI_MODE=mock` to `AI_MODE=python` should change the intelligence provider without changing registration, login, user persistence or the frontend workflow.
