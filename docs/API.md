# Orbit AI — REST API Specification

This document specifies the complete HTTP REST API contract exposed by the Orbit Node backend (`http://127.0.0.1:5101`).

---

## Authentication & Identity

All protected endpoints require the HTTP Authorization header:
```http
Authorization: Bearer <jwt-token>
```

### 1. Register Account
- **Method**: `POST /api/auth/register`
- **Rate Limit**: 30 requests/minute
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-11-19 12:00:00"
    }
  }
  ```

### 2. Login
- **Method**: `POST /api/auth/login`
- **Rate Limit**: 30 requests/minute
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response `200 OK`**: Returns token and user object.

### 3. Current User
- **Method**: `GET /api/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Returns authenticated user profile.

---

## System Diagnostics

### 4. Health Check
- **Method**: `GET /api/health`
- **Public**: Yes
- **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "database": "sqlite",
    "aiMode": "mock",
    "agentStudioConfigured": true,
    "system": {
      "uptimeSeconds": 1420,
      "nodeVersion": "v22.0.0",
      "heapUsedMb": 38.5,
      "timestamp": "2026-11-19T14:00:00.000Z"
    }
  }
  ```

---

## AI Agent Studio Gateway

Orbit acts as a secure reverse gateway to the live AI Agent Studio platform. Orbit derives the user identity (`orbit-user-<id>`) server-side and binds it to all external requests.

### 5. Get Agent Catalog
- **Method**: `GET /api/agents/catalog`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "count": 64,
    "agents": [
      {
        "id": "b2b_saas_roi_analyst",
        "name": "B2B SaaS ROI Analyst",
        "category": "Sales Intelligence",
        "externalApi": true,
        "mode": "analyze",
        "operations": [{ "name": "analyze" }]
      }
    ],
    "_meta": {
      "latencyMs": 42,
      "timestamp": "2026-11-19T14:00:00.000Z"
    }
  }
  ```

### 6. Get Agent Contract
- **Method**: `GET /api/agents/:agentId/contract`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Returns contract schema, example inputs, and allowed operations.

### 7. Execute Studio Agent
- **Method**: `POST /api/agents/:agentId/:action`
- **Headers**: `Authorization: Bearer <token>`
- **Rate Limit**: 60 requests/minute
- **Request Body**:
  ```json
  {
    "input": {
      "investment_cost": 10000,
      "attributed_revenue": 35000
    }
  }
  ```
- **Response `200 OK`**: Agent output payload with timing metadata.

---

## Bookmarks & Favorites

### 8. List Favorites
- **Method**: `GET /api/agents/favorites`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{"favorites": ["IRMA-20-03", "b2b_saas_roi_analyst"]}`

### 9. Add Favorite
- **Method**: `POST /api/agents/favorites/:key`
- **Headers**: `Authorization: Bearer <token>`
- **Response `201 Created`**: `{"success": true, "agentKey": "IRMA-20-03", "favorited": true}`

### 10. Remove Favorite
- **Method**: `DELETE /api/agents/favorites/:key`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{"success": true, "agentKey": "IRMA-20-03", "favorited": false}`
