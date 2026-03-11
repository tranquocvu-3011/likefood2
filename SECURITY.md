# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in LIKEFOOD, please report it responsibly:

1. **Email:** Send details to `nd.anh@hutech.edu.vn` with subject `[SECURITY] LIKEFOOD vulnerability`
2. **Include in your report:**
   - Type of vulnerability (XSS, SQL Injection, Auth bypass, etc.)
   - Affected endpoints or components
   - Step-by-step reproduction instructions
   - Potential impact assessment
   - Suggested fix (optional but appreciated)

## Response Timeline

| Step | Timeline |
|------|----------|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix & patch release | Within 14 days for critical issues |
| Public disclosure | After fix is deployed |

## Security Measures in LIKEFOOD

- **Authentication:** NextAuth.js with bcrypt password hashing, 2FA via OTP
- **Rate Limiting:** Upstash Redis — all API endpoints rate-limited
- **Input Validation:** Zod schema validation on all inputs
- **SQL Injection:** Prisma ORM with parameterized queries — no raw SQL
- **XSS Prevention:** Next.js escapes output by default; Content Security Policy headers
- **CORS:** Configurable via `ALLOWED_ORIGIN` environment variable
- **Secrets:** All credentials in environment variables — never hardcoded
- **Error Monitoring:** Sentry for real-time error tracking
- **Audit Logging:** All sensitive actions logged with user/IP metadata
- **HTTPS:** Nginx with LetsEncrypt SSL in production

## Known Limitations

- Email-based 2FA (OTP via email) is offered as additional security, not mandatory
- Session management relies on NextAuth.js defaults

## Responsible Disclosure

We follow a coordinated disclosure policy. Security researchers who responsibly report valid vulnerabilities will be acknowledged in our CHANGELOG.

Thank you for helping keep LIKEFOOD and its users safe!
