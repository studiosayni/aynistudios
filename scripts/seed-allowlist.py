#!/usr/bin/env python3
# One-time bootstrap: grants admin portal access by creating Firestore
# `_allowlist/{email}` docs (see _docs/AYNI_ARCHITECTURE.md for the schema).
#
# Run it yourself (requires gcloud logged in as the project owner):
#   python3 scripts/seed-allowlist.py
#
# Add future team/client emails via the Firebase console or the admin UI —
# this script is only for bootstrapping the first admins on a fresh project.
import json, subprocess, urllib.request, datetime, sys

PROJECT = "aynistudios-fe09b"
ADMINS = ["studiosayni@gmail.com", "humanity@ayni-studios.com"]
WORKSPACE = "ayni-admin"

token = subprocess.run(
    ["gcloud", "auth", "print-access-token"], capture_output=True, text=True
).stdout.strip()
if not token:
    sys.exit("gcloud not authenticated — run `gcloud auth login` first")

base = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents"
now = datetime.datetime.now(datetime.timezone.utc).isoformat()

for email in ADMINS:
    body = {
        "fields": {
            "email": {"stringValue": email},
            "workspaceId": {"stringValue": WORKSPACE},
            "role": {"stringValue": "admin"},
            "addedAt": {"stringValue": now},
        }
    }
    req = urllib.request.Request(
        f"{base}/_allowlist/{email}",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "x-goog-user-project": PROJECT,
        },
        method="PATCH",
    )
    with urllib.request.urlopen(req) as r:
        print("OK", email, r.status)

print("Done — these emails can now sign in as admins.")
