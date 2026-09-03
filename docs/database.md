# Database Schema Documentation — Relational Architecture (MySQL 8+ / Prisma)

## Overview
The database uses a normalized relational schema built on MySQL 8+ and managed via Prisma ORM.

## Entities
- `User`: Accounts, credentials, department, and status (`ACTIVE`, `SUSPENDED`, `LOCKED`, `DEACTIVATED`).
- `Role`: System roles (`SUPER_ADMIN`, `ADMIN`, `CASE_OFFICER`, `INVESTIGATOR`, `LEGAL_OFFICER`, `REVIEWER`, `AUDITOR`, `VIEWER`).
- `Permission`: Fine-grained permission codes (`CASE_CREATE`, `DOCUMENT_VIEW`, `DOCUMENT_DOWNLOAD`, `DOCUMENT_APPROVE`, `AUDIT_VIEW`).
- `Department`: Organizational units (Investigation, Legal, Forensics, Administration).
- `Case`: Primary case container (`case_number`, `title`, `status`, `priority`, `department_id`, `assigned_officer_id`).
- `Document`: Document metadata linked to a case (`title`, `category`, `classification`, `status`).
- `DocumentVersion`: Multi-version file records (`version_number`, `storage_key`, `sha256_hash`, `file_size`, `uploaded_by`).
- `AuditLog`: Append-only security audit log (`event`, `user_id`, `entity_type`, `entity_id`, `result`, `ip_address`).
- `Approval`: Document review/approval workflow state (`reviewer_id`, `status`, `comments`).
