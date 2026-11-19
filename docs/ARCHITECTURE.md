# Orbit AI System Architecture

## Component Interaction Flow

```
[Browser / React] --(1. Orbit JWT)--> [Orbit Node Backend]
                                             |
                                             +--(2. SQLite DB)
                                             |
                                      (3. External SSO API)
                                             |
                                             v
                                  [AI Agent Studio Backend]
                                             |
                                             v
                                  [Python Intelligence Engine]
```

1. **Client Tier**: React 19 single page application. Authenticates exclusively to Orbit Node backend.
2. **Host Gateway Tier**: Orbit Express backend with SQLite persistence. Owns user sessions, stores local history, and enforces rate limits.
3. **Studio API Tier**: External AI Agent Studio platform. Validates server credentials and executes requested agent capabilities.
