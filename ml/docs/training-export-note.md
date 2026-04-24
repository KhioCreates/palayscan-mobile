# PALAYSCAN Future Training and Export Note

## Scope

This note describes the future workflow only. It does **not** add a real model yet.

## Intended path

1. collect labeled images for the five routing labels
2. review and split the dataset
3. train a small image classifier offline
4. evaluate routing performance
5. export a `.tflite` model
6. later integrate the model into a development build or native build

## Why this should stay small

The precheck model only needs to answer:

- is it a plant?
- does it likely look like rice?
- is the image usable enough?

That means a lightweight image classification model is the right fit.

## Recommended training/export direction

Use official TensorFlow Lite image-classification guidance as the basis:

- [Image classification overview](https://www.tensorflow.org/lite/models/image_classification/overview)
- [TensorFlow Lite Model Maker guide](https://www.tensorflow.org/lite/guide/model_maker)
- [Model Maker image classification tutorial](https://www.tensorflow.org/lite/tutorials/model_maker_image_classification)

Practical direction:

- start with transfer learning
- keep labels simple
- prefer quantized export for mobile size and speed
- export a `.tflite` model and keep label definitions documented

## Expo integration limitation

Expo Go cannot be the final runtime for custom native on-device ML inference.

For real on-device model use, PALAYSCAN will later need:

- an Expo development build or another native build path
- a native on-device inference runtime
- a small model asset bundled with the app or otherwise packaged for local use

Official Expo basis:

- [Add custom native code](https://docs.expo.dev/workflow/customizing/)
- [Use a development build](https://docs.expo.dev/develop/development-builds/use-development-builds/)
- [Create a development build](https://docs.expo.dev/develop/development-builds/create-a-build)

## Current architecture benefit

The current app already has a reusable precheck verdict contract, so the future model runner should
be able to plug into the existing scan flow without redesigning `ScanHomeScreen`.
