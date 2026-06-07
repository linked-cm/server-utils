---
"@_linked/server-utils": patch
---

`initFrontend` now returns `Promise<void>` (was `Promise<unknown>`), so callers can await it without an explicit cast.

Also: the `build` script now requires `lib/esm` and `lib/cjs` to exist after compile, so a silently-failing build no longer produces an empty published tarball.
