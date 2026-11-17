$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  $secret = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
  (Get-Content ".env") -replace "replace-with-a-long-random-secret", $secret | Set-Content ".env"
  Write-Host "Created local .env with a random JWT secret."
}

if (-not (Test-Path "node_modules")) { npm install }
if (-not (Test-Path "backend/node_modules")) { npm install --prefix backend }
if (-not (Test-Path "frontend/node_modules")) { npm install --prefix frontend }

Write-Host ""
Write-Host "Starting Orbit AI POC..."
Write-Host "Frontend: http://127.0.0.1:3002"
Write-Host "Backend:  http://127.0.0.1:5101"
Write-Host ""
npm run dev
