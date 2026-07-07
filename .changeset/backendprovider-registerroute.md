---
"@_linked/server-utils": patch
---

`BackendProvider` gains `registerRoute(method, path, ...handlers)` + `disposeRoutes()` — register express routes/middleware that are tracked and torn down on HMR reload (so backend source changes don't stack duplicate middleware). Used by `@_linked/auth`'s `dispose()`. Fixes `this.registerRoute is not a function` on boot.

Also: `Server.ts` re-exports `CallConfig` with `export type` (it's an interface) — fixes the runtime ESM error "does not provide an export named 'CallConfig'".
