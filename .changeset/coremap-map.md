---
'@_linked/server-utils': patch
---

Serialization: replace removed `CoreMap` with native `Map` (core dropped CoreMap in `b2de3ad`). Fixes `Cannot find module @_linked/core/collections/CoreMap` on a clean install.
