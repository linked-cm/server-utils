---
"@_linked/server-utils": patch
---

`Server.removeDefaultHeaders(...names)` / `LincdServerProxy.removeDefaultHeaders(...names)` — remove default headers previously set via `addDefaultHeaders` (used by scoped request contexts like CN's DataRouting to tear down routing headers on unmount).
