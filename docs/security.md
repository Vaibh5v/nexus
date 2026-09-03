# Security Architecture Documentation

## Security Principles
1. **Zero Frontend Trust**: All authentication, authorization, role checking, file validation, and hash checks are enforced server-side.
2. **Cryptographic Data Integrity**: Every document upload generates a SHA-256 hash stored in MySQL. Integrity checks re-hash stored files upon download or audit.
3. **HttpOnly Cookie Sessions**: Session tokens are transmitted via `HttpOnly`, `SameSite=Lax`, `Secure` cookies, mitigating XSS storage risks.
4. **Append-Only Security Audit Engine**: Every authentication and document operation logs an immutable record for judicial review.
5. **Rate Limiting & Account Protection**: Progressive lockouts after consecutive failed authentication attempts.
