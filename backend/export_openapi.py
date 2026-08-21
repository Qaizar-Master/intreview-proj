"""Write the OpenAPI schema to docs/openapi.json.

FastAPI builds this schema from the route definitions and Pydantic models, so it
cannot drift from the code. Exporting it to a file makes the API importable into
Postman or Insomnia and readable in the repository without running the server.

Regenerate after changing any endpoint or schema:

    python export_openapi.py
"""

import json
from pathlib import Path

from app.main import app

OUTPUT = Path(__file__).resolve().parent.parent / "docs" / "openapi.json"


def main() -> None:
    schema = app.openapi()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    # Trailing newline keeps the file diff-friendly in git.
    OUTPUT.write_text(json.dumps(schema, indent=2) + "\n")
    print(f"Wrote {OUTPUT} ({len(schema['paths'])} paths)")


if __name__ == "__main__":
    main()
