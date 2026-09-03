# API Reference Documentation — RESTful Standards

## Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Verify credentials & initiate session
- `POST /api/auth/mfa/verify` — Verify 6-digit TOTP code
- `GET /api/auth/me` — Retrieve active session user profile
- `POST /api/auth/logout` — Destroy session & clear cookies

### Cases (`/api/cases`)
- `GET /api/cases` — List cases with filtering & pagination
- `POST /api/cases` — Create new case record
- `GET /api/cases/:id` — Case details, assigned team, timeline & documents

### Documents (`/api/documents`)
- `GET /api/documents` — Search & list documents
- `POST /api/documents` — Upload new document with SHA-256 calculation
- `GET /api/documents/:id` — Document metadata & version history
- `GET /api/documents/:id/download` — Download authorized document file
- `POST /api/documents/:id/verify-integrity` — Verify SHA-256 checksum

### Audit Logs (`/api/audit-logs`)
- `GET /api/audit-logs` — Auditor security log stream
