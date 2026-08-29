---
'@_linked/server-utils': patch
---

Encode scoped package names before building `/call/:pkg/...` proxy routes.

This fixes server calls into scoped packages such as `@_linked/auth`, where package names contain `/` and must be URL-encoded to remain a single route segment.
