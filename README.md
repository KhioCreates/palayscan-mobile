# PALAYSCAN Mobile

PALAYSCAN is an Expo React Native mobile app for rice pest and disease identification, farming guidance, planner scheduling, and local history.

## Current Scan Modes

- `EXPO_PUBLIC_SCAN_MODE=mock`
  Uses the local mock scan path and does not call Kindwise.
- `EXPO_PUBLIC_SCAN_MODE=live`
  Uses live image checking. For tester builds, point this to the PALAYSCAN proxy with `EXPO_PUBLIC_SCAN_PROXY_URL`.

## Android Tester Scan Proxy

The proxy scaffold is in:

- [proxy/cloudflare-worker](proxy/cloudflare-worker)

Recommended tester env:

```text
EXPO_PUBLIC_SCAN_MODE=live
EXPO_PUBLIC_SCAN_PROXY_URL=https://palayscan-scan-proxy.your-account.workers.dev/scan
EXPO_PUBLIC_SCAN_PROXY_KEY=replace_with_proxy_client_key

# Keep direct Kindwise commented for local fallback only.
# EXPO_PUBLIC_KINDWISE_API_URL=https://crop.kindwise.com/api/v1
# EXPO_PUBLIC_KINDWISE_API_KEY=replace_with_kindwise_key
```

When `EXPO_PUBLIC_SCAN_PROXY_URL` is set, the app sends scans through the proxy and does not call Kindwise directly.

## Future Offline Router Note

The project includes a placeholder seam for a future on-device Kindwise router pre-filter in:

- [src/features/scan/services/routerPrefilter.ts](src/features/scan/services/routerPrefilter.ts)

Current status:

- Expo Go is not suitable for the real offline router runtime.
- A development build will be required.
- Native runtime setup will also be required, likely through Expo prebuild plus a supported on-device inference runtime.
- The recommended first model to try later is `router.tiny`.

When the app is ready for that future step:

1. Move from Expo Go to an Expo development build.
2. Add the native model runtime package compatible with the Kindwise router model format.
3. Bundle the router model asset, starting with `router.tiny`.
4. Replace the placeholder `runRouterPrefilter()` implementation with real on-device inference.
5. Use the returned router verdict to block irrelevant images before the live Crop.Health request.
