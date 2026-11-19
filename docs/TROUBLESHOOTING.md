# Troubleshooting Guide

### Port Collisions
If port 5101 or 3002 is already occupied:
```powershell
Get-NetTCPConnection -LocalPort 5101,3002 | Stop-Process -Id {$_.OwningProcess} -Force
```

### Upstream Service Unreachable (503)
Verify AI Agent Studio backend is active on port 5000:
```powershell
curl http://127.0.0.1:5000/api/health
```

### Missing Environment Secrets
Ensure `.env` contains `JWT_SECRET`, `AI_AGENT_STUDIO_PROJECT_ID`, and `AI_AGENT_STUDIO_API_TOKEN`.
