---
"@_linked/server-utils": patch
---

Rebuild + republish. The 1.0.5 tarball was missing all `.js` files (only `.d.ts` shipped) because `yarn linked build` was silently failing inside CI at the dual-package step. Switch to the explicit per-step build pattern that `@_linked/cli` itself uses (`rimraf && build-esm && build-cjs && copy-to-lib && dual-package`), which fails loudly per step and produces complete `lib/esm/` + `lib/cjs/` output with their dual-package `package.json` markers.
