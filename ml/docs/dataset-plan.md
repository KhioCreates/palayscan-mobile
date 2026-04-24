# PALAYSCAN Precheck Dataset Plan

## Purpose

The future PALAYSCAN precheck model is only a **gate before Kindwise live scan**.

Its purpose is to reduce wasted live-scan credits by blocking clearly unrelated or low-quality
images before the paid request is sent. It is **not** a pest, disease, or nutrient diagnosis model.

## Target labels

Recommended labels:

- `rice_clear`
- `rice_unclear`
- `plant_not_rice`
- `non_plant`
- `unusable_image`

## Label definitions

### `rice_clear`

Use this label when:

- the image clearly shows rice plant content
- the image quality is good enough for a live scan
- the subject is framed closely enough to be useful

Examples:

- clear rice leaf close-up
- clear rice stem photo
- clear rice field photo where rice is still the main subject

### `rice_unclear`

Use this label when:

- the image likely shows rice
- but the quality, angle, framing, or distance is weak
- and it should be blocked from live scan until the user provides a better image

Examples:

- blurry rice leaf
- rice field photo taken from too far away
- dim, shadowed, or partly blocked rice image

### `plant_not_rice`

Use this label when:

- the image clearly shows a plant
- but it does not appear to be rice

Examples:

- wheat head or wheat leaves
- corn leaves
- ornamental plants
- broadleaf weeds or garden plants

### `non_plant`

Use this label when:

- the image is not mainly a plant image

Examples:

- person or face
- hand holding the phone
- table, wall, or floor
- tools, vehicles, bags, paper, or machinery

### `unusable_image`

Use this label when:

- the image is too poor to trust for routing
- and the model should block it before live scan

Examples:

- very dark image
- almost fully blurred image
- lens covered or blocked
- image with severe motion blur

## Label-to-verdict mapping

| Label | isPlant | isRiceLikely | isUsable | Confidence meaning |
|---|---:|---:|---:|---|
| `rice_clear` | true | true | true | confidence that image is a clear rice image usable for routing |
| `rice_unclear` | true | true | false | confidence that image is probably rice but not usable enough |
| `plant_not_rice` | true | false | true | confidence that image is a plant but not rice |
| `non_plant` | false | false | false | confidence that image is not a plant image |
| `unusable_image` | false | false | false | confidence that the image should be blocked due to quality |

## Suggested minimum dataset targets

Recommended minimum pilot targets for a first small model:

- `rice_clear`: 300 images
- `rice_unclear`: 250 images
- `plant_not_rice`: 300 images
- `non_plant`: 300 images
- `unusable_image`: 250 images

Total pilot minimum: **1,400 images**

Preferred stronger target for a more reliable first model:

- 500 to 1,000 images per label

## Balance guidance

Try to keep the label counts reasonably balanced. A routing classifier can become biased if
`rice_clear` dominates the dataset while `non_plant` or `unusable_image` remain too small.

## Official basis used for this plan

- Expo custom native code and development builds:
  - [Add custom native code](https://docs.expo.dev/workflow/customizing/)
  - [Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- TensorFlow Lite image classification:
  - [Image classification overview](https://www.tensorflow.org/lite/models/image_classification/overview)
  - [Model Maker image classification tutorial](https://www.tensorflow.org/lite/tutorials/model_maker_image_classification)
