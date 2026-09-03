# Architecture Documentation — Secure Digital Document Management System

## Overview
The Secure Digital Document Management System (DMS) is a multi-tier, high-security web platform engineered for law enforcement agencies, legal departments, courts, and investigative bodies.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Axios, React Hook Form.
- **Backend**: Node.js, Express, TypeScript, RESTful API architecture, Helmet, CORS, Rate Limiting, Winston logging.
- **Database**: MySQL 8+ with Prisma ORM.
- **File Storage**: Abstracted `StorageService` (Local Filesystem for dev, S3-compatible Object Storage abstraction for prod).
- **Integrity**: SHA-256 cryptographic hashing per document version.
- **Security & Audit**: HttpOnly session management, RBAC, immutable append-only audit trail logging.

## Core Flow
```text
React Client ---> Express REST API ---> Service Layer ---> Prisma ORM ---> MySQL
                                       ---> StorageService ---> Physical File Store
                                       ---> Audit Engine ---> MySQL Audit Logs
```
