# Security Policy

## Supported Versions

PathPrune has not published a stable release yet. Until v1.0.0, security fixes target the latest `main` branch and the newest published package version when one exists.

| Version | Supported |
| --- | --- |
| 0.x | Best effort |

## Reporting a Vulnerability

Please do not include exploit details, secrets, or sensitive repository contents in public issues.

If GitHub private vulnerability reporting is enabled, use it. Otherwise, open a minimal public issue asking for a private reporting path and omit sensitive details.

## Scope

In scope:

- Path traversal or reads outside the requested scan root.
- Unexpected writes, deletes, staging, network calls, or telemetry.
- Dependency or release-process vulnerabilities in this repository.

Out of scope:

- General cleanup advice.
- Bugs in downstream projects scanned with PathPrune.
- Requests for guaranteed response timelines.

## Project Safety Posture

PathPrune is designed to be non-destructive: it scans local files, prints dry-run reports, and never deletes files. Please report any behavior that violates that boundary.
