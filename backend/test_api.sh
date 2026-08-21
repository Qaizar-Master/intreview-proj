#!/usr/bin/env bash
# Manual smoke test of every endpoint. Run with the server up:
#   ./test_api.sh
# Point at a different host by passing it as the first argument:
#   ./test_api.sh http://192.168.1.15:8000
set -u
BASE="${1:-http://localhost:8000}"
echo "Testing $BASE"
echo

# -s silences the progress bar, -w prints the HTTP status after the body.
show() { curl -s -w "\n  -> HTTP %{http_code}\n\n" "$@"; }

echo "## health"
show "$BASE/health"

echo "## POST /practices  (expect 201)"
CREATED=$(curl -s -X POST "$BASE/practices" \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "Elevator pitch",
        "description": "Deliver a 60-second self introduction.",
        "duration_minutes": 15,
        "difficulty": "Beginner",
        "status": "Pending"
      }')
echo "$CREATED"
ID=$(printf '%s' "$CREATED" | grep -oP '"id":\s*\K[0-9]+' | head -1)
echo "  -> created id=$ID"
echo

echo "## GET /practices  (expect 200, newest first)"
show "$BASE/practices"

echo "## PUT /practices/$ID  (expect 200 — full replacement)"
show -X PUT "$BASE/practices/$ID" \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "Elevator pitch v2",
        "description": "Deliver a 90-second self introduction.",
        "duration_minutes": 20,
        "difficulty": "Intermediate",
        "status": "Pending"
      }'

echo "## PATCH /practices/$ID/complete  (expect 200, status -> Completed)"
show -X PATCH "$BASE/practices/$ID/complete"

echo "## DELETE /practices/$ID  (expect 204, empty body)"
show -X DELETE "$BASE/practices/$ID"

echo "## PATCH on the deleted id  (expect 404)"
show -X PATCH "$BASE/practices/$ID/complete"

echo "## POST with invalid data  (expect 422)"
show -X POST "$BASE/practices" \
  -H 'Content-Type: application/json' \
  -d '{"title": "", "duration_minutes": -5}'
