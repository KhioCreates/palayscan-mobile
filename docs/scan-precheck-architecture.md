# PALAYSCAN Scan Precheck Architecture Note

## Purpose

This note explains the preferred long-term direction for the PALAYSCAN scan precheck layer.

The current goal is to protect Kindwise live-scan credits **without** locking PALAYSCAN into a
permanent paid cloud precheck service. The preferred long-term direction is a small **on-device**
image precheck model that can run before the live Kindwise request.

## Why a permanent cloud gate is not the preferred long-term solution

A permanent remote gate creates a second recurring cost path on top of the live scan service.
That is risky for a student project or long-lived field tool because:

- every image can create another paid request before the real scan request
- long-term maintenance depends on another external vendor or backend
- app usefulness can degrade if the cloud gate is no longer funded or maintained

For PALAYSCAN, the safer long-term direction is to keep the current scan safeguards and prepare to
swap the verdict source later with an on-device model.

## Why on-device precheck is the preferred long-term solution

An on-device precheck model can help block clearly unrelated images before the paid Kindwise scan
request. This is the best fit for PALAYSCAN because it can eventually:

- reduce recurring per-request cost
- run without relying on another cloud vendor
- improve long-term sustainability for offline-first field use
- preserve the current scan UI and save-protection flow

## Honest Expo limitation

Expo Go is **not** the final runtime for custom on-device ML integration.

Custom on-device ML inference will require a **development build** or another native build path,
because Expo Go only supports the native modules bundled into Expo Go itself.

This is consistent with Expo documentation on custom native code and development builds:

- Expo custom native code: [Add custom native code](https://docs.expo.dev/workflow/customizing/)
- Expo development builds: [Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- Expo Go limitations: [Expo FAQ](https://docs.expo.dev/faq/)

## What already supports the future swap

The current scan architecture already has useful seams:

- `src/features/scan/screens/ScanHomeScreen.tsx`
  - runs the precheck before the Kindwise live request
  - does not need to know whether the verdict comes from a remote gate or a future on-device model
- `src/features/scan/services/scanPrecheck.ts`
  - generic precheck entry point
  - current implementation delegates to the temporary remote gate client
  - future implementation can delegate to an on-device model runner instead
- `src/features/scan/services/scanPrecheckTypes.ts`
  - shared verdict contract and future dataset label definitions
- `src/features/scan/services/scanValidation.ts`
  - decides whether a precheck verdict is good enough for a live scan
- `src/features/scan/services/scanStorage.ts`
  - local history persistence stays separate from the precheck source
- current save-protection rules
  - still block bad results from polluting history even after analysis

## Reusable verdict contract

The verdict source should keep returning this shape:

```ts
type ScanPrecheckVerdict = {
  isPlant: boolean;
  isRiceLikely: boolean;
  isUsable: boolean;
  confidence: number;
  reason?: string;
};
```

This is intentionally simple and reusable. It supports either:

- a temporary remote precheck API, or
- a future on-device classifier

without forcing a redesign of `ScanHomeScreen`.

## Future dataset labels

Recommended small-label dataset design:

- `rice_clear`
  - clear rice image with usable quality
  - examples: clear rice leaf, stem, or field photo suitable for scan
- `rice_unclear`
  - likely rice, but image quality or framing is weak
  - examples: blurry rice image, poor lighting, too far away, too much background
- `plant_not_rice`
  - plant is visible, but it does not look like rice
  - examples: wheat, corn, ornamentals, weeds, garden leaves
- `non_plant`
  - image does not mainly show a plant
  - examples: people, faces, hands, tools, furniture, vehicles, documents
- `unusable_image`
  - image quality is too poor for reliable routing
  - examples: very dark, fully blurred, blocked camera, severe motion blur

## Label-to-verdict mapping

Suggested mapping:

- `rice_clear`
  - `isPlant = true`
  - `isRiceLikely = true`
  - `isUsable = true`
- `rice_unclear`
  - `isPlant = true`
  - `isRiceLikely = true`
  - `isUsable = false`
- `plant_not_rice`
  - `isPlant = true`
  - `isRiceLikely = false`
  - `isUsable = true`
- `non_plant`
  - `isPlant = false`
  - `isRiceLikely = false`
  - `isUsable = false`
- `unusable_image`
  - `isPlant` may be uncertain, but the safest output is:
  - `isPlant = false`
  - `isRiceLikely = false`
  - `isUsable = false`

`confidence` should be the model confidence for the selected label or final routed verdict.

## What the future on-device model should output

The future model does not need to perform full disease diagnosis.

It only needs to answer a small routing question:

1. does this image likely contain a plant?
2. does it likely look like rice?
3. is the image usable enough for the paid/live scan?

That makes a compact image classification model a better fit than a larger diagnosis model.

## Training/export direction

Recommended reference direction:

- LiteRT / TensorFlow Lite for on-device inference
- TensorFlow image classification workflow for training/export

Helpful official references:

- Expo custom native code: [Add custom native code](https://docs.expo.dev/workflow/customizing/)
- Expo development builds: [Use a development build](https://docs.expo.dev/develop/development-builds/use-development-builds/)
- TensorFlow Lite Model Maker: [Model Maker guide](https://www.tensorflow.org/lite/guide/model_maker)
- TensorFlow image classification: [Image classification overview](https://www.tensorflow.org/lite/models/image_classification/overview)
- TensorFlow Lite Model Maker image classification tutorial:
  [Model Maker image classification tutorial](https://www.tensorflow.org/lite/tutorials/model_maker_image_classification)

Practical direction:

- start with a small image classifier model
- export to `.tflite`
- prefer quantized export for mobile size and speed
- evaluate against the five-label routing task above

## What should stay unchanged

These parts should stay even after on-device integration:

- manual rice confirmation checkbox as a user reminder
- current result save-protection rules
- history integrity rules for invalid live results
- mock/live scan mode separation
- the scan result UI and navigation flow

## What should later be swapped

### Keep

- `ScanHomeScreen` flow structure
- `shouldAllowLiveScanFromGate()` verdict evaluation logic
- `shouldAutoSaveScanResult()` history protection logic

### Replace later

- current temporary remote provider call in `scanPrecheck.ts`

Future replacement idea:

- `scanPrecheck.ts` becomes the provider selector
- current remote gate becomes optional
- future native model runner becomes the preferred provider in development/native builds

## Migration plan

### Phase 1 = current safe state

- live scan still works through Kindwise
- mock mode still works
- current local confirmation and history save guards stay active
- current temporary remote gate can still be used if configured

### Phase 2 = architecture prepared

- generic precheck entry point stays separate from the scan screen
- verdict contract is shared and reusable
- codebase is ready for provider swapping without scan-screen redesign

### Phase 3 = train small model offline

- collect and label a routing dataset using the five labels above
- train a compact image classifier
- validate precision/recall for blocking unrelated or low-quality images
- export a mobile-friendly `.tflite` model

### Phase 4 = integrate on-device model in dev/native build

- move from Expo Go to a development build or native build path
- add the required native model runtime
- run the on-device classifier before Kindwise live scan
- keep existing save rules and result behavior

### Phase 5 = optionally remove remote gate entirely

- once the on-device precheck is reliable enough
- remote gate can become optional or be removed
- Kindwise remains the only paid per-request scan dependency

## Bottom line

PALAYSCAN should keep the current stable scan flow now, while preparing to replace the temporary
remote precheck with a future small on-device classifier. That path offers the lowest long-term
cost and the cleanest sustainability story for a rice-focused mobile tool.
