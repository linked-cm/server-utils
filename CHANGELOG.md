# @\_linked/server-utils

## 1.0.6

### Patch Changes

- [#5](https://github.com/linked-cm/server-utils/pull/5) [`88cb730`](https://github.com/linked-cm/server-utils/commit/88cb730784ceffabb187d44eb3b8d3279e38aac5) Thanks [@flyon](https://github.com/flyon)! - Rebuild + republish. The 1.0.5 tarball was missing all `.js` files (only `.d.ts` shipped) because `yarn linked build` was silently failing inside CI at the dual-package step. Switch to the explicit per-step build pattern that `@_linked/cli` itself uses (`rimraf && build-esm && build-cjs && copy-to-lib && dual-package`), which fails loudly per step and produces complete `lib/esm/` + `lib/cjs/` output with their dual-package `package.json` markers.

## 1.0.5

### Patch Changes

- [#4](https://github.com/linked-cm/server-utils/pull/4) [`620ff0f`](https://github.com/linked-cm/server-utils/commit/620ff0f7b815ceb19117a78ec7fc4fb5191a5916) Thanks [@flyon](https://github.com/flyon)! - `initFrontend` now returns `Promise<void>` (was `Promise<unknown>`), so callers can await it without an explicit cast.

  Also: the `build` script now requires `lib/esm` and `lib/cjs` to exist after compile, so a silently-failing build no longer produces an empty published tarball.

- [`6965162`](https://github.com/linked-cm/server-utils/commit/696516211de3a2a8b5b1f863f118b467c18330ee) - `LincdServerProxy.parseShape`: prefer the `packageName` stored on the shape constructor (set by `@_linked/core` during `linkedPackage()` registration) instead of extracting it from the URI. The URI form passes through `URI.sanitize` which is lossy (`@_linked/server` → `-_linked-server`), so the sanitized segment can't round-trip as a Node module specifier. Falls back to URI parsing for shapes predating the `packageName` property.

  Also: restore previously-deleted `src/types.d.ts` (CSS module declarations) needed by tsconfig.

## 1.0.4

### Patch Changes

- [`887c3cc`](https://github.com/linked-cm/server-utils/commit/887c3cca90a0dddbc14b70088302b0459da36e0d) - Initial release under the new publishing setup.
