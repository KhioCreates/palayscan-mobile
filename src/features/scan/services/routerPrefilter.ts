export type RouterModelName = 'router.tiny' | 'router.small' | 'router.base';

export type RouterPrefilterVerdict = 'allow' | 'block' | 'unavailable';

export type RouterPrefilterResult = {
  verdict: RouterPrefilterVerdict;
  reason?: string;
  model: RouterModelName;
};

export const recommendedRouterModel: RouterModelName = 'router.tiny';

/**
 * Runtime readiness snapshot for the future offline router integration.
 *
 * Important:
 * - Expo Go is not a suitable target for the real Kindwise offline router runtime.
 * - A development build is the expected next step because the router model will need
 *   a native inference runtime such as a TFLite-compatible bridge.
 * - In practice this likely means Expo prebuild or equivalent native setup work
 *   before the placeholder seam in this file can be replaced with a real model call.
 * - When that future step happens, `router.tiny` is the safest first model to try
 *   for PALAYSCAN because it is optimized for speed and smaller footprint.
 */
export function getRouterRuntimeReadiness() {
  return {
    expoGoSupported: false,
    developmentBuildRequired: true,
    nativeRuntimeRequired: true,
    recommendedModel: recommendedRouterModel,
  };
}

/**
 * Placeholder integration seam for a future on-device Kindwise router model.
 *
 * Why this is not fully enabled yet:
 * - The Kindwise router models are distributed for mobile-friendly runtimes such as TFLite.
 * - Expo Go cannot load arbitrary native ML runtimes.
 * - A development build or prebuild/native setup is needed to add a TFLite/ONNX runtime safely.
 * - We intentionally do not fake model loading here because that would create a misleading
 *   implementation and risk breaking the current working scan flow.
 * - The recommended first model for PALAYSCAN is `router.tiny` once the native runtime path exists.
 *
 * Current behavior:
 * - returns `unavailable`
 * - does not block the existing mock/live scan flow
 * - keeps the app startup and Expo Go workflow stable
 *
 * Future replacement plan:
 * 1. Move from Expo Go to a development build.
 * 2. Add the native inference runtime package.
 * 3. Bundle the router model asset, starting with `router.tiny`.
 * 4. Replace this placeholder return value with real on-device inference.
 * 5. Use the returned verdict to block obviously irrelevant images before the live API call.
 */
export async function runRouterPrefilter(_imageUri: string): Promise<RouterPrefilterResult> {
  return {
    verdict: 'unavailable',
    reason:
      'Offline router pre-filter is not enabled in this Expo build yet. A development build with a native model runtime is required.',
    model: recommendedRouterModel,
  };
}
