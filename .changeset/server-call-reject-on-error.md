---
'@_linked/server-utils': minor
---

Add an opt-in to reject failed server calls. Pass `{ method, rejectOnError: true }` to `Server.call` (or `LincdServerProxy.call`) and a non-2xx response rejects with a `ServerCallError` carrying the HTTP `status` and the server's `{error}` message, instead of resolving `undefined`. On the backend's local server path the opt-in rejects an unmatched call with status 501 and wraps a provider error as status 500. Without the opt-in, behaviour is unchanged. `ServerCallError` is exported from `utils/Server` and `utils/LincdServerProxy`.
