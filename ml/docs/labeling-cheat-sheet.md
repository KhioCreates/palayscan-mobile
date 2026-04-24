# PALAYSCAN Labeling Cheat Sheet

## `rice_clear`

Belongs here:

- clear rice leaf, stem, or rice field images
- rice is the main subject
- image quality is good enough for live scan

Does not belong here:

- blurry rice
- far-away rice field shots where detail is weak
- non-rice plants

Examples:

- clear rice leaf close-up
- clear rice stem image
- clear rice field section with visible rice plants

## `rice_unclear`

Belongs here:

- image probably shows rice
- but quality or framing is not good enough for live scan

Does not belong here:

- clearly usable rice images
- non-rice plants
- non-plant photos

Examples:

- blurry rice leaf
- dim rice photo
- rice field image taken too far away

## `plant_not_rice`

Belongs here:

- plant is clearly visible
- but it does not look like rice

Does not belong here:

- rice images
- non-plant images
- unusable blurry images if quality is too poor to tell

Examples:

- corn leaf
- wheat image
- ornamental house plant

## `non_plant`

Belongs here:

- image mainly shows people or objects instead of plants

Does not belong here:

- any clearly visible plant image
- blurry plant images that should be `unusable_image`

Examples:

- person selfie
- hand holding phone
- chair, wall, table, or tools

## `unusable_image`

Belongs here:

- image quality is too poor to trust
- routing should stop before live scan

Does not belong here:

- clear plant images
- clear non-plant images
- clear non-rice plant images

Examples:

- almost fully black image
- severe motion blur
- blocked lens photo

## Quick rule when unsure

Ask these questions in order:

1. Is it usable enough to judge?
2. Is it mainly a plant?
3. Does it likely look like rice?

Then label it:

- usable + plant + rice -> `rice_clear`
- not usable but probably rice -> `rice_unclear`
- usable + plant + not rice -> `plant_not_rice`
- not mainly a plant -> `non_plant`
- too poor to trust -> `unusable_image`
