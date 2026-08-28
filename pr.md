# Fix issues #1058, #1059, #1060, and #1061

All four issues have been resolved in this PR.

## Summary

- **#1058 [Backend] GET /supporters/:address pagination** — Replaced hand-rolled pagination parsing with the shared `paginationSchema` using `z.coerce.number().int().min(1).max(100)`, preventing negative limits from triggering Prisma's reverse-pagination semantics.
- **#1059 [Frontend] EditProfileButton wallet-adapter fix** — Replaced `adapter.connect()` calls with passive "get already-connected address" methods so wallet permission prompts no longer appear for every visitor, only on explicit user action.
- **#1060 [Frontend] Byte-safe memo truncation** — Added U+FFFD replacement character check after byte-length match to prevent stray replacement characters from being injected into truncated memos.
- **#1061 [Frontend] useToast per-toast timer** — Tracked timeout in a ref and clear it at the start of every `showToast` call so only the most recent toast's timer controls dismissal.
