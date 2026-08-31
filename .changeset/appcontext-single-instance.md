---
'@_linked/server-utils': patch
---

Pin `AppContext` on `globalThis` so module re-evaluation cannot fork it.

The dev server loads this module on two different lifecycles: `LinkedServer`
imports `AppContextProvider` statically and is instantiated once at boot, while
the consumers below it (`AppRoot`, `Html`) arrive via
`vite.ssrLoadModule('/src/App.tsx')`, which is re-evaluated on every full SSR
invalidation. Because `server-utils` is bundled into the SSR graph, a bare
`createContext` call then handed the consumers a NEW context object while the
provider still held the boot-time one. `useAppContext()` found no matching
provider, returned null, and every SSR render threw "Cannot destructure property
'isNativeApp' of useAppContext()".

The stale provider is pinned inside the long-lived server object, so this never
recovered on its own: a single HMR page reload could flip a working dev server
into serving 500s on every request until the process was restarted. It also
presented as a bare "SSR timed out" rather than the real error, because
`onShellError` did not answer the request (fixed separately in `@_linked/server`).

Pinning the context object on `globalThis` keeps provider and consumer on one
context across re-evaluations.
