---
"@_linked/server-utils": minor
---

- `Server.call` now retries transient failures (connection-level rejections and 502/503/504) with exponential backoff, so a dropped socket / gateway blip under load no longer fails the request hard. 4xx and plain 500 are not retried (the server already processed the request).
- Published **ESM-only** (dropped the CJS build). No CJS `require` consumers remained; this matches the rest of the `@_linked/*` fleet and lets the build resolve `@_linked/core`'s `exports` map.
