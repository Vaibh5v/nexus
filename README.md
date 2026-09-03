# 🏛️ Secure Digital Document Management System (Police & Legal DMS)

[![Production Build](https://img.shields.io/badge/System-Production%20Ready-emerald)](http://localhost:5173)
[![License](https://img.shields.io/badge/Government-Restricted%20Access-blue)]()
[![Security](https://img.shields.io/badge/Cryptography-SHA--256%20Integrity-155E8A)]()

An enterprise-grade, highly secure, scalable, and auditable **Digital Document Management System (DMS)** purpose-built for law enforcement agencies, prosecution departments, judicial review boards, and forensic investigation commands.

---

## 🚀 Quick Start Links

- **Frontend Application Portal**: **[http://localhost:5173](http://localhost:5173)**
- **Backend REST API Server**: **[http://localhost:5001](http://localhost:5001)** (`/api/health`)

---

## 🏛️ System Architecture

The application is structured as a production-grade monorepo containing a React TypeScript client, Node.js Express server, MySQL database schema via Prisma ORM, and comprehensive architectural documentation.

```text
Sevion Monorepo Root
├── client/                  # React 18 + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── context/         # AuthContext & Session Management
│   │   ├── features/        # Feature Modules (Cases, Documents, Approvals, Users, Audit, Settings)
│   │   ├── layouts/          # DashboardLayout & Navigation Shell
│   │   ├── routes/           # ProtectedRoute Component
│   │   └── services/         # Axios API Client Configuration
│   └── package.json
├── server/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/     # REST API Controller Handlers
│   │   ├── middleware/      # RBAC & Session Protection Middleware
│   │   ├── routes/          # Express API Route Registries
│   │   ├── security/        # PBKDF2 Hashing & Cookie Session Manager
│   │   ├── services/        # Business Logic Services (Case, Document, Approval, User)
│   │   ├── storage/         # StorageService Abstraction Layer (Filesystem / S3)
│   │   └── audit/           # AuditService Logging Engine
│   ├── prisma/              # Prisma Relational Schema & Seed Scripts
│   └── package.json
└── docs/                    # Architectural Specifications
    ├── architecture.md      # System Component Architecture
    ├── database.md          # Database ER Entities & Relationships
    ├── api.md               # REST API Endpoint Specifications
    └── security.md          # Security Architecture & Cryptography Rules
```

---

## 🌟 Core System Modules & Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **PBKDF2 Password Hashing**: Passwords stored with 10,000 iterations, SHA-512 digest, and 16-byte random salt.
- **Timing-Safe Comparison**: `crypto.timingSafeEqual()` prevents side-channel CPU timing attacks.
- **HttpOnly Cookie Sessions**: Session tokens issued as encrypted `HttpOnly` cookies (`police_dms_session`) to prevent client-side JavaScript XSS theft.
- **7 Preseeded Roles**: Fine-grained permission rules for `SUPER_ADMIN`, `ADMIN`, `INVESTIGATOR`, `LEGAL_OFFICER`, `REVIEWER`, `AUDITOR`, and `VIEWER`.

### 2. 📂 Case Management System
- **Case CRUD REST APIs**: Initiate, update, search, and manage investigation records.
- **Auto-Generated Case Numbers**: Format `CASE-2026-00101`.
- **6-Tab Case Hub (`CaseDetails.tsx`)**:
  - **Overview**: Classification, priority, lead officer, and operational scope.
  - **Documents Vault**: Attached case files with SHA-256 checksums and version history.
  - **Team & Stakeholders**: Assigned investigating officers, forensic leads, and legal counsel.
  - **Timeline & Activity**: Chronological history of case updates.
  - **Tasks**: Action items, due dates, and completion status.
  - **Audit History**: Real-time append-only security log stream for the case.

### 3. 🛡️ Cryptographic SHA-256 Document Storage & Integrity Engine
- **Automated Checksum Generation**: Calculates 64-character SHA-256 hex checksums on upload.
- **Live Integrity Verification**: One-click **Verify Hash** button re-reads the physical file from disk in real-time to confirm `MATCH VALID` or trigger a `🚨 INTEGRITY MISMATCH DETECTED` security alert.
- **In-Browser Document Previewer (`DocumentPreviewModal.tsx`)**: Secure inline streaming viewer with full-screen mode, SHA-256 checksum bar, and security watermarks.

### 4. 📜 Multi-Version Control & Append-Only Lineage
- **Zero Overwrites**: Updating a file appends Version 2.0 (`v2.0`) without deleting or overwriting historical `v1.0` file binaries on disk.
- **Version Notes & Downloads**: Tracks change log rationale and allows downloading any historical version independently.

### 5. ✍️ Formal Approval Workflows & Legal Review
- **Review State Machine**: Document status transitions `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `APPROVED` / `REJECTED`.
- **Pending Approvals Module (`/approvals`)**: Reviewer directory and interactive reviewer dialog (`ApprovalReviewModal.tsx`) for prosecutors and review board officers.

### 6. 👥 Agency User Directory & Clearance Level Governance
- **Personnel Directory (`/users`)**: Tracks Employee IDs, Badge Numbers, Departments, Roles, and Clearance Levels (`Level 1` to `Level 4 - Top Secret`).
- **Account Status Toggles**: One-click Suspend or Activate account controls with real-time audit logging.
- **Account Provisioning Modal (`UserModal.tsx`)**: Modal dialog for registering new officers.

### 7. 🔍 Global Search & System Settings
- **Top Header Global Search**: Real-time cross-entity keyword lookup returning matching Cases, Documents, and Personnel with instant dropdown navigation.
- **System Settings Panel (`/settings`)**: Configures session timeouts, password expiry policies, max upload file size limits (25 MB), rate limiting, and storage health.

---

## 🗝️ Preseeded Demo Credentials

> 🔒 **Universal Password for ALL Demo Accounts:** `password123`

| System Role | Official Email (Login ID) | Employee ID | Clearance Level | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| 🕵️‍♂️ **INVESTIGATOR** | `investigator@example.com` | `EMP-1002` | Level 3 - Confidential & Classified | `password123` |
| ⚖️ **LEGAL_OFFICER** | `legal@example.com` | `EMP-1003` | Level 3 - Legal Confidential | `password123` |
| 🔍 **REVIEWER** | `reviewer@example.com` | `EMP-1004` | Level 3 - Classified Review | `password123` |
| 🛡️ **AUDITOR** | `auditor@example.com` | `EMP-1005` | Level 4 - Audit Compliance | `password123` |
| 🛠️ **ADMIN** | `admin@example.com` | `EMP-1001` | Level 4 - Top Secret | `password123` |
| 👑 **SUPER_ADMIN** | `superadmin@example.com` | `EMP-1000` | Level 4 - Top Secret | `password123` |
| 👁️ **VIEWER** | `viewer@example.com` | `EMP-1006` | Level 1 - Internal Only | `password123` |

---

## ⚙️ Installation & Local Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL Server**: v8.0+ (Optional for local testing; in-memory/seed storage included)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-org/police-dms.git
cd police-dms

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Build & Run Application Services

```bash
# Terminal 1: Build & Start Backend Express API Server (Port 5001)
cd server
npm run build
npm start

# Terminal 2: Start Frontend Vite Dev Server (Port 5173)
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser and click any demo account button to test!

---

## 📚 Technical Documentation

Detailed architectural and technical specification documents are available in the `/docs` directory:

- 📐 [**Architecture Guide**](file:///Users/vaibhavgaikar/Desktop/Sevion/docs/architecture.md) — Monorepo & System Component Flow
- 🗄️ [**Database Specification**](file:///Users/vaibhavgaikar/Desktop/Sevion/docs/database.md) — Relational MySQL Prisma ER Model
- 🌐 [**REST API Specifications**](file:///Users/vaibhavgaikar/Desktop/Sevion/docs/api.md) — Endpoints, Query Parameters & Payload Formats
- 🔐 [**Security & Cryptography Guide**](file:///Users/vaibhavgaikar/Desktop/Sevion/docs/security.md) — PBKDF2, SHA-256 & Session Cookie Controls

---

## 📄 License & Compliance

Police Digital Document Management System &copy; 2026 — Ministry of Home Affairs. All Rights Reserved. Restrictive Government License.
