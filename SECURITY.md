# Security Policy – AirWise AI

## 🛡️ Overview
Security is a foundational tenet of **AirWise AI**. We adhere to OWASP Top 10 guidelines and strict secret isolation standards.

---

## 🔒 Security Architecture & Guarantees

### 1. Zero Client-Side Secret Exposure
- Sensitive API keys (e.g. `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`) are **strictly managed in the backend environment** (`.env` or server process memory).
- Frontend application bundles and network API requests never contain or transmit secret keys to the browser.
- All GenAI calls are proxied through authenticated FastAPI server endpoints (`/api/v1/ai/*`).

### 2. OWASP Recommended Security Headers
The FastAPI backend enforces mandatory security headers on every response:
- `X-Content-Type-Options: nosniff` (Prevents MIME-type sniffing attacks)
- `X-Frame-Options: DENY` (Mitigates clickjacking attacks)
- `X-XSS-Protection: 1; mode=block` (Reflected XSS filter)
- `Referrer-Policy: strict-origin-when-cross-origin` (Protects referrer leakages)
- `Permissions-Policy: geolocation=(self)` (Restricts sensitive sensor access)

### 3. Rate Limiting & DoS Mitigation
- The backend features an in-memory sliding-window rate limiter (120 requests/minute per client IP) to protect AI generation endpoints from abuse, credential stuffing, and denial-of-service attempts.

### 4. Input Validation & Sanitization
- All incoming payloads are validated using Pydantic V2 schemas.
- Coordinate parameters are constrained to valid geographical bounds (`-90 <= lat <= 90`, `-180 <= lon <= 180`).
- String queries are sanitized and truncated to prevent buffer exploits.

### 5. Protected Git Tracking
- The project `.gitignore` explicitly blocks `.env`, secret files, build caches, and node_modules from being tracked or committed to version control.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or security bug, please report it privately:
- **Email**: `kethavathbharathn@gmail.com`
- **Response SLA**: Initial triage within 24 hours.
