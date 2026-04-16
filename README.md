# PALAYSCAN Mobile

PALAYSCAN is an Expo React Native mobile app for rice pest and disease identification, farming guidance, planner scheduling, and local history.

## Current Scan Modes

- `EXPO_PUBLIC_SCAN_MODE=mock`
  Uses the local mock scan path and does not call Kindwise.
- `EXPO_PUBLIC_SCAN_MODE=live`
  Uses the live Kindwise Crop.Health identification endpoint.

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
