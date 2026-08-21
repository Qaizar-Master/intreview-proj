# API Documentation

**Production:** `https://practice-api-5avg.onrender.com`
Local development: `http://localhost:8000`
From a phone on the same network: `http://<your-laptop-lan-ip>:8000`

Interactive documentation is generated from the code and served by the running
API itself:

| | |
|---|---|
| Swagger UI (try requests live) | [https://practice-api-5avg.onrender.com/docs](https://practice-api-5avg.onrender.com/docs) |
| ReDoc (reference layout) | [https://practice-api-5avg.onrender.com/redoc](https://practice-api-5avg.onrender.com/redoc) |
| OpenAPI schema (JSON) | [https://practice-api-5avg.onrender.com/openapi.json](https://practice-api-5avg.onrender.com/openapi.json) |

Running locally, the same pages are at `http://localhost:8000/docs`,
`/redoc` and `/openapi.json`.

The same schema is committed to this repository as
[`openapi.json`](openapi.json), so it can be read or imported into an API client
without running the server. Import it into Postman or Insomnia to get every
endpoint pre-configured.

All request and response bodies are JSON (`Content-Type: application/json`).
Every sample below is real output captured from a running instance.

---

## The Practice resource

```json
{
  "id": 4,
  "title": "Elevator pitch",
  "description": "Deliver a 60-second self introduction.",
  "duration_minutes": 15,
  "difficulty": "Beginner",
  "status": "Pending",
  "created_at": "2026-08-20T12:31:50.139647Z",
  "updated_at": "2026-08-20T12:31:50.139647Z"
}
```

| Field | Type | Writable | Rules |
|---|---|---|---|
| `id` | integer | no | assigned by the database |
| `title` | string | yes | required, 1–200 characters |
| `description` | string | yes | optional, defaults to `""`, max 5000 |
| `duration_minutes` | integer | yes | required, 1–1440 |
| `difficulty` | enum | yes | `Beginner` \| `Intermediate` \| `Advanced` |
| `status` | enum | yes | `Pending` \| `Completed` |
| `created_at` | ISO 8601 datetime | no | set by the database on insert |
| `updated_at` | ISO 8601 datetime | no | set by the database on every write |

Enum values are case-sensitive and must match exactly.

---

## Endpoint summary

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| `POST` | `/practices` | Create a practice | `201 Created` |
| `GET` | `/practices` | List all practices | `200 OK` |
| `PUT` | `/practices/{id}` | Replace a practice | `200 OK` |
| `PATCH` | `/practices/{id}/complete` | Mark completed | `200 OK` |
| `DELETE` | `/practices/{id}` | Delete a practice | `204 No Content` |
| `GET` | `/health` | Liveness check | `200 OK` |

---

## POST /practices

Creates a practice session.

**Request**

```http
POST /practices
Content-Type: application/json
```

```json
{
  "title": "Elevator pitch",
  "description": "Deliver a 60-second self introduction.",
  "duration_minutes": 15,
  "difficulty": "Beginner",
  "status": "Pending"
}
```

`description`, `difficulty` and `status` may be omitted; they default to `""`,
`"Beginner"` and `"Pending"` respectively.

**Response — `201 Created`**

```json
{
  "title": "Elevator pitch",
  "description": "Deliver a 60-second self introduction.",
  "duration_minutes": 15,
  "difficulty": "Beginner",
  "status": "Pending",
  "id": 4,
  "created_at": "2026-08-20T12:31:50.139647Z",
  "updated_at": "2026-08-20T12:31:50.139647Z"
}
```

The full object is returned so the client learns the server-assigned `id`
without a second request.

**Status codes**

| Code | When |
|---|---|
| `201` | Created |
| `422` | Validation failed — see [Error responses](#error-responses) |

**Example**

```bash
curl -X POST http://localhost:8000/practices \
  -H 'Content-Type: application/json' \
  -d '{"title":"Elevator pitch","description":"Deliver a 60-second self introduction.","duration_minutes":15,"difficulty":"Beginner","status":"Pending"}'
```

---

## GET /practices

Returns every practice session, **newest first** (ordered by `created_at`
descending).

**Request**

```http
GET /practices
```

No parameters.

**Response — `200 OK`**

```json
[
  {
    "title": "Elevator pitch v2",
    "description": "Deliver a 90-second self introduction.",
    "duration_minutes": 20,
    "difficulty": "Intermediate",
    "status": "Completed",
    "id": 4,
    "created_at": "2026-08-20T12:31:50.139647Z",
    "updated_at": "2026-08-20T12:31:50.252260Z"
  }
]
```

An empty collection returns `200` with `[]`, not `404`.

**Status codes**

| Code | When |
|---|---|
| `200` | Always, on success |

**Example**

```bash
curl http://localhost:8000/practices
```

---

## PUT /practices/{id}

Replaces every editable field of an existing practice. This is a **full
replacement**, not a partial update — omitted optional fields revert to their
defaults.

**Request**

```http
PUT /practices/4
Content-Type: application/json
```

```json
{
  "title": "Elevator pitch v2",
  "description": "Deliver a 90-second self introduction.",
  "duration_minutes": 20,
  "difficulty": "Intermediate",
  "status": "Pending"
}
```

**Response — `200 OK`**

```json
{
  "title": "Elevator pitch v2",
  "description": "Deliver a 90-second self introduction.",
  "duration_minutes": 20,
  "difficulty": "Intermediate",
  "status": "Pending",
  "id": 4,
  "created_at": "2026-08-20T12:31:50.139647Z",
  "updated_at": "2026-08-20T12:31:50.220727Z"
}
```

`created_at` is unchanged; `updated_at` has advanced.

**Status codes**

| Code | When |
|---|---|
| `200` | Updated |
| `404` | No practice with that id |
| `422` | Validation failed |

**Example**

```bash
curl -X PUT http://localhost:8000/practices/4 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Elevator pitch v2","description":"Deliver a 90-second self introduction.","duration_minutes":20,"difficulty":"Intermediate","status":"Pending"}'
```

---

## PATCH /practices/{id}/complete

Marks a practice as completed. **No request body.**

The operation is idempotent — calling it on an already-completed practice
succeeds and changes nothing, so a double tap in the UI is harmless.

**Request**

```http
PATCH /practices/4/complete
```

**Response — `200 OK`**

```json
{
  "title": "Elevator pitch v2",
  "description": "Deliver a 90-second self introduction.",
  "duration_minutes": 20,
  "difficulty": "Intermediate",
  "status": "Completed",
  "id": 4,
  "created_at": "2026-08-20T12:31:50.139647Z",
  "updated_at": "2026-08-20T12:31:50.252260Z"
}
```

**Status codes**

| Code | When |
|---|---|
| `200` | Marked completed |
| `404` | No practice with that id |

**Example**

```bash
curl -X PATCH http://localhost:8000/practices/4/complete
```

---

## DELETE /practices/{id}

Permanently deletes a practice.

**Request**

```http
DELETE /practices/4
```

**Response — `204 No Content`**

Empty body by design.

**Status codes**

| Code | When |
|---|---|
| `204` | Deleted |
| `404` | No practice with that id |

**Example**

```bash
curl -i -X DELETE http://localhost:8000/practices/4
```

---

## GET /health

Liveness check. Touches no database and no business logic, so a `200` here
isolates "the network path and server are fine" from "my query is broken".
Useful for confirming a phone can reach the API.

**Response — `200 OK`**

```json
{ "status": "ok" }
```

---

## Error responses

### `404 Not Found`

Returned by any endpoint addressing a specific id that does not exist.

```json
{
  "detail": "Practice 999999 not found"
}
```

### `422 Unprocessable Entity`

Returned when the request body fails validation. `detail` is an **array** — all
failures are reported at once, not just the first.

Request that produced this:

```json
{ "title": "", "duration_minutes": -5 }
```

Response:

```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "title"],
      "msg": "String should have at least 1 character",
      "input": "",
      "ctx": { "min_length": 1 }
    },
    {
      "type": "greater_than",
      "loc": ["body", "duration_minutes"],
      "msg": "Input should be greater than 0",
      "input": -5,
      "ctx": { "gt": 0 }
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `loc` | path to the offending field, e.g. `["body", "title"]` |
| `msg` | human-readable explanation |
| `type` | machine-readable error code |
| `input` | the value that was rejected |

Because `loc` identifies the exact field, a client can map each error to the
matching form input rather than showing one generic message.

---

## Notes for API consumers

**Field naming.** Fields are `snake_case` on the wire (`duration_minutes`) and
are consumed unchanged by the mobile client — no camelCase conversion layer.

**Mutations return the affected object.** `POST`, `PUT` and `PATCH` all respond
with the complete practice, so a client can update its local state from the
response instead of re-fetching the collection.

**Timestamps** are generated by PostgreSQL (`now()`), not by the application, so
they are consistent regardless of which machine issued the request. They are
returned in UTC, ISO 8601, with a `Z` suffix.

**CORS** is open (`allow_origins=["*"]`) for local development. Native mobile
clients do not enforce CORS; this exists for browser-based clients such as
Swagger UI and the Expo web preview. It would be restricted to known origins
before any real deployment.

**Authentication** is not implemented — out of scope for this assignment.
