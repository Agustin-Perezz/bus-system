# API - REST Endpoints

## Base URL

```
http://localhost:3000
```

## Swagger

Interactive documentation available at:

```
http://localhost:3000/api
```

The Swagger UI is the source of truth for request/response schemas, validation
rules, and error shapes. Use it to explore each endpoint in detail.

---

## Resources

Five resources, each with full CRUD:

| Resource | Base path | Description | FK |
|----------|-----------|-------------|----|
| Enterprise | `/enterprises` | Bus companies | `ownerId` → User |
| Route | `/routes` | Travel routes between terminals | — |
| User | `/users` | People (may own an enterprise) | — |
| Bus | `/buses` | Vehicles owned by an enterprise | `enterpriseId` → Enterprise |
| Trip | `/trips` | Scheduled departures on a route | `routeId` → Route |

---

## Endpoint Summary

Every resource exposes the same five operations:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/{resource}` | Create a new resource |
| `GET` | `/{resource}` | List resources (paginated) |
| `GET` | `/{resource}/:id` | Get a resource by ID |
| `PUT` | `/{resource}/:id` | Update a resource (partial, only provided fields) |
| `DELETE` | `/{resource}/:id` | Delete a resource |

### Pagination

`GET` list endpoints accept query parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 10 | Items per page |
| `offset` | number | 0 | Items to skip |

Returns `{ items: [...], total, limit, offset }`.

---

## Request Bodies

### Enterprise

```json
{ "name": "Acme Bus Co.", "legalId": "US-12-3456789", "ownerId": "<uuid>" }
```

- `legalId` is immutable after creation.
- `ownerId` must reference an existing user (404 if missing). Each user can own at most one enterprise (unique constraint).

### Route

```json
{ "name": "Central - North", "origin": "Terminal Central", "destination": "Terminal Norte" }
```

### User

```json
{ "name": "Jane Driver", "email": "jane@acme.com", "role": "driver" }
```

- `email` must be unique.
- `role` must be one of `admin`, `driver`, `user`.

A user may own an enterprise; the ownership relation is created from the
Enterprise side (`POST /enterprises` with `ownerId`).

### Bus

```json
{ "model": "Mercedes-Benz O500", "enterpriseId": "<uuid>" }
```

- `enterpriseId` must reference an existing enterprise (404 if missing).

### Trip

```json
{ "departureAt": "2026-08-10T08:00:00.000Z", "routeId": "<uuid>" }
```

- `departureAt` is an ISO 8601 date string.
- `routeId` must reference an existing route (404 if missing).

---

## FK Validation Ordering

For resources with a foreign key, the use case validates FK existence FIRST
(404) before any business constraint (400). A missing reference takes
precedence over a duplicate or invalid value — you can't violate a business
rule for an entity that points to something that doesn't exist.

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK — successful read or update |
| `201` | Created — resource created |
| `204` | No Content — successful deletion |
| `400` | Bad Request — invalid data or business constraint violation |
| `404` | Not Found — resource or FK target not found |
| `500` | Internal Server Error |