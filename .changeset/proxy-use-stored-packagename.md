---
'@_linked/server-utils': patch
---

`LincdServerProxy.parseShape`: prefer the `packageName` stored on the shape constructor (set by `@_linked/core` during `linkedPackage()` registration) instead of extracting it from the URI. The URI form passes through `URI.sanitize` which is lossy (`@_linked/server` → `-_linked-server`), so the sanitized segment can't round-trip as a Node module specifier. Falls back to URI parsing for shapes predating the `packageName` property.

Also: restore previously-deleted `src/types.d.ts` (CSS module declarations) needed by tsconfig.
