## What does this PR do?

This PR resolves four testing and security issues (#756 – #759):

1. **#756 — Unit tests for `profile-importer.ts`** (`backend/src/services/profile-importer.test.ts`):
   Added a complete test suite using Node's built-in `node:test` runner and `vi.stubGlobal`-style fetch mocking.
   Covers: successful fetch and field mapping, 404 → `GitHubUserNotFoundError`, 403/429 with `X-RateLimit-Remaining: 0` → `GitHubRateLimitError`, non-rate-limited 403 → `GitHubFetchError`, network error → `GitHubFetchError(status=0)`, `resetAt` Date parsing, `null` bio/website/twitter mapped to empty-string / `null` (not the string `"null"`), URL normalisation, bio truncation at 280 chars.

2. **#757 — Component tests for `ActivityFeed`** (`frontend/src/components/activity-feed.test.tsx`):
   Added a Vitest + `@testing-library/react` suite with `vi.stubGlobal` fetch mocking.
   Covers: skeleton loading state, empty-state "No activity yet", transaction items with amount/asset/timestamp, "Load more" button visibility gated by item count, expanding items on click, milestone-reached rendering with title, network-error message, partial-failure notice when milestones API fails but transactions load.

3. **#758 — Component tests for the multi-step create profile wizard** (`frontend/src/app/create/page.test.tsx`):
   Added a Vitest + `@testing-library/react` + `userEvent` suite.
   Covers: Step 1 → Step 2 navigation gated by valid `displayName` + `username` + `bio`; username validation (leading hyphen rejected, too-short rejected, valid alphanumeric+hyphen accepted); Step 2 asset quick-pick toggle; Step 3 submit calls `POST /profiles` with correct body; `RATE_LIMIT_EXCEEDED` 429 shows countdown message; `USERNAME_TAKEN` / `EMAIL_TAKEN` API errors surface on the correct field.

4. **#759 — Move auth JWT from `localStorage` to `httpOnly` cookie**:
   - **`backend/src/app.ts`**: Added `cookie-parser` middleware. `POST /auth/verify` now sets a `Set-Cookie: auth_token=<jwt>; HttpOnly; SameSite=Lax; Secure (prod only); Max-Age=3600` header in addition to returning the token in JSON (so API / mobile consumers are unaffected).
   - **`backend/src/auth.ts`**: `requireAuth` and `optionalAuth` now accept the token from either the `Authorization: Bearer` header (API clients) **or** `req.cookies.auth_token` (browser sessions), whichever is present first.
   - **`frontend/src/lib/api-client.ts`**: Removed the manual `Authorization` header injection that read from `localStorage`. Added `credentials: "include"` so the browser automatically attaches the cookie on every API call. `localStorage.removeItem("authToken")` on 401 is kept to clean up any legacy tokens.
   - **`backend/package.json`**: Added `cookie-parser` (runtime) and `@types/cookie-parser` (dev).

### Supporting changes
- CORS updated to `credentials: true` in `backend/src/app.ts` so the browser is permitted to send the cookie on cross-origin requests.

## Related issues

Closes #756, #757, #758, #759

## Type of change

- [x] Bug fix (security hardening #759)
- [x] New feature (tests #756, #757, #758)
- [ ] Refactor
- [ ] Docs / config only

## How to test

### #756 — Backend profile-importer tests
```bash
cd backend
NODE_ENV=test tsx src/services/profile-importer.test.ts
```
All 16 test assertions should pass.

### #757 — ActivityFeed component tests
```bash
cd frontend
npx vitest run src/components/activity-feed.test.tsx
```

### #758 — CreatePage wizard tests
```bash
cd frontend
npx vitest run src/app/create/page.test.tsx
```

### #759 — httpOnly cookie auth

**Backend:**
```bash
# Verify the Set-Cookie header appears on /auth/verify
curl -X POST http://localhost:4000/v1/auth/verify \
  -H 'Content-Type: application/json' \
  -d '{"walletAddress":"G…","signature":"…"}' -v 2>&1 | grep -i set-cookie
```
Expect: `Set-Cookie: auth_token=ey…; Path=/; HttpOnly; SameSite=Lax`

**Frontend (browser DevTools):**
1. Complete the wallet-sign flow.
2. Open Application → Cookies → `localhost` — `auth_token` should appear with HttpOnly flag set.
3. Open Application → Local Storage — `authToken` should **not** be present.
4. Any `apiFetch()` call should succeed without an `Authorization` header; the cookie is sent automatically.

## Checklist

- [x] I have read the CONTRIBUTING guide
- [x] My branch is up to date with upstream/main (fast-forward merged)
- [x] Linter passes (`npm run lint`)
- [x] Tests pass (`npm test`) if applicable
- [x] I have not committed `.env` files or secrets