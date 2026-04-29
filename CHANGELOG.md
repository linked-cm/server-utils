# @\_linked/server-utils

## 1.0.5

### Patch Changes

- [`6965162`](https://github.com/linked-cm/server-utils/commit/696516211de3a2a8b5b1f863f118b467c18330ee) - `LincdServerProxy.parseShape`: prefer the `packageName` stored on the shape constructor (set by `@_linked/core` during `linkedPackage()` registration) instead of extracting it from the URI. The URI form passes through `URI.sanitize` which is lossy (`@_linked/server` → `-_linked-server`), so the sanitized segment can't round-trip as a Node module specifier. Falls back to URI parsing for shapes predating the `packageName` property.

  Also: restore previously-deleted `src/types.d.ts` (CSS module declarations) needed by tsconfig.

## 1.0.4

### Patch Changes

- [`887c3cc`](https://github.com/linked-cm/server-utils/commit/887c3cca90a0dddbc14b70088302b0459da36e0d) - Initial release under the new publishing setup.
